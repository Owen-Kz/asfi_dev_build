const { PDFDocument } = require('pdf-lib');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const mammoth = require('mammoth');
const puppeteer = require('puppeteer');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ dest: 'uploads/' }).fields([
  { name: 'manuscript_file', maxCount: 1 },
  { name: 'tracked_manuscript', maxCount: 1 },
  { name: 'figures', maxCount: 10 },
  { name: 'supplementary_material', maxCount: 1 },
  { name: 'graphic_abstract', maxCount: 1 },
  { name: 'tables', maxCount: 10 }
]);

const uploadToCloudinary = async (filePath, folder, publicId, fileExtension) => {
  const resourceType = (fileExtension === '.pdf') ? 'raw' : 'auto';
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: 'auto',
    folder: folder,
    public_id: publicId
  });
  return result.secure_url;
};

const convertDocxToPdf = async (docxPath, outputPdfPath) => {
  try {
    const docxBuffer = fs.readFileSync(docxPath);
    const { value: html } = await mammoth.convertToHtml({ buffer: docxBuffer });
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html);
    await page.pdf({ path: outputPdfPath, format: 'A4' });
    await browser.close();
  } catch (error) {
    console.error(`Error converting DOCX to PDF: ${docxPath}`, error);
    throw new Error('Failed to convert DOCX to PDF');
  }
};

const isValidPDF = (filePath) => {
  const buffer = fs.readFileSync(filePath);
  return buffer.toString('utf-8', 0, 5) === '%PDF-';
};

const mergePDFs = async (filePaths, outputFilePath) => {
  const mergedPdf = await PDFDocument.create();
  for (const filePath of filePaths) {
    if (!fs.existsSync(filePath)) continue;
    try {
      const pdfBytes = fs.readFileSync(filePath);
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    } catch (error) {
      console.error(`Error processing PDF file: ${filePath}`, error);
    }
  }
  const mergedPdfBytes = await mergedPdf.save();
  fs.writeFileSync(outputFilePath, mergedPdfBytes);
};

const cleanUpFiles = (files) => {
  files.forEach((file) => {
    if (fs.existsSync(file.path)) {
      fs.unlink(file.path, (err) => {
        if (err) console.error(`Error cleaning up file: ${file.path}`, err);
      });
    }
  });
};

const CombinePDF = async (req, res) => {
  upload(req, res, async (err) => {
    console.log("STARTING PDF FUNCTION")
    if (err) {
    console.error('Error uploading files', err);
      return res.status(500).json({ success: false, message: 'Error uploading files' });
    }
    const { revisionId } = req.body;
    try {
      const files = Object.values(req.files || {}).flat();
      if (!files.length) {
      console.log('No files uploaded');
        return res.status(400).json({ success: false, message: 'No files uploaded' });
      }
      
      const pdfFiles = [];
      const cloudinaryOriginalUrls = [];
      const cloudinaryPdfUrls = [];
      
      for (const file of files) {
        if (file.originalname.toLowerCase() === 'dummy.pdf') continue;
        const fileExtension = path.extname(file.originalname).toLowerCase();
        const publicId = `${revisionId}-${file.fieldname}-${path.basename(file.originalname, fileExtension)}`;
        
        // Upload original file
        const originalUrl = await uploadToCloudinary(file.path, 'asfirj/original', publicId, fileExtension);
        cloudinaryOriginalUrls.push(originalUrl);
        
        let filePath = file.path;
        if (fileExtension === '.docx') {
          const pdfPath = `${file.path}.pdf`;
          await convertDocxToPdf(file.path, pdfPath);
          filePath = pdfPath;
        }
        
        if (fileExtension === '.pdf' && !isValidPDF(filePath)) {
          console.error(`Skipping invalid PDF file: ${filePath}`);
          continue;
        }
        
        const pdfUrl = await uploadToCloudinary(filePath, 'asfirj/pdf', `${publicId}-pdf`, '.pdf');
        cloudinaryPdfUrls.push(pdfUrl);
        pdfFiles.push(filePath);
      }
      
      if (!pdfFiles.length) {
      console.log('No valid PDF files to combine');
        return res.status(400).json({ success: false, message: 'No valid PDF files to combine' });
      }
      
      const outputFilePath = path.join('uploads', `${revisionId}_combined.pdf`);
      await mergePDFs(pdfFiles, outputFilePath);
      
      const combinedUploadUrl = await uploadToCloudinary(outputFilePath, 'asfirj/combined', `${revisionId}_combined`, '.pdf');
      cleanUpFiles(files);
      fs.unlink(outputFilePath, (err) => {
        if (err) console.error(`Error cleaning up combined file: ${outputFilePath}`, err);
      });
      
      res.json({
        success: true,
        originalFiles: cloudinaryOriginalUrls,
        pdfFiles: cloudinaryPdfUrls,
        combinedFile: combinedUploadUrl
      });
    } catch (error) {
      console.error('Error processing files', error);
      res.status(500).json({ success: false, message: 'Error processing files', more: error.message });
    }
  });
};

module.exports = CombinePDF;
