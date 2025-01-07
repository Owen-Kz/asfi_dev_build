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
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: 'auto', // Ensures non-image files are uploaded correctly
    folder: folder,
    public_id: publicId,
    format: fileExtension.replace('.', '') // Ensures the correct file extension is preserved
  });
  return result.secure_url;
};


const convertDocxToPdf = async (docxPath, outputPdfPath) => {
  const docxBuffer = fs.readFileSync(docxPath);
  const { value: html } = await mammoth.convertToHtml({ buffer: docxBuffer });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
});
  const page = await browser.newPage();
  await page.setContent(html);
  await page.pdf({ path: outputPdfPath, format: 'A4' });
  await browser.close();
};

const mergePDFs = async (filePaths, outputFilePath) => {
  const mergedPdf = await PDFDocument.create();

  for (const filePath of filePaths) {
    const pdfBytes = fs.readFileSync(filePath);
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedPdfBytes = await mergedPdf.save();
  fs.writeFileSync(outputFilePath, mergedPdfBytes);
};

const cleanUpFiles = (files) => {
  files.forEach((file) => {
    fs.unlink(file.path, (err) => {
      if (err) console.error(`Error cleaning up file: ${file.path}`, err);
    });
  });
};


const CombinePDF = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error uploading files' });
    }

    const { revisionId } = req.body;

    try {
      const { manuscript_file, tracked_manuscript, figures, supplementary_material, graphic_abstract, tables } = req.files;

      const allFiles = [
        ...(manuscript_file || []),
        ...(tracked_manuscript || []),
        ...(figures || []),
        ...(supplementary_material || []),
        ...(graphic_abstract || []),
        ...(tables || [])
      ];

      const pdfFiles = [];
      const cloudinaryOriginalUrls = [];
      const cloudinaryPdfUrls = [];

      for (const file of allFiles) {
        // Skip dummy.pdf files
        if (file.originalname.toLowerCase() === 'dummy.pdf') {
          console.log(`Skipping file: ${file.originalname}`);
          continue;
        }

        const fileExtension = path.extname(file.originalname).toLowerCase();
        const publicId = `${revisionId}-${file.fieldname}-${path.basename(file.originalname, fileExtension)}`;

        // Upload the original file to Cloudinary
        const originalUrl = await uploadToCloudinary(file.path, 'asfirj/original', publicId, fileExtension);
        cloudinaryOriginalUrls.push(originalUrl);

        let filePath = file.path;

        // Convert Word documents to PDF and upload the converted version
        if (fileExtension === '.docx') {
          const pdfPath = `${file.path}.pdf`;
          await convertDocxToPdf(file.path, pdfPath);
          filePath = pdfPath; // Use the converted PDF path
        }

        const pdfUrl = await uploadToCloudinary(filePath, 'asfirj/pdf', `${publicId}-pdf`, '.pdf');
        cloudinaryPdfUrls.push(pdfUrl);
        pdfFiles.push(filePath);
      }

      if (pdfFiles.length === 0) {
        return res.status(400).json({ success: false, message: 'No valid PDF files to combine' });
      }

      // Merge PDFs locally
      const prefix = revisionId;
      const outputFilePath = path.join('uploads', `${prefix}_combined.pdf`);
      await mergePDFs(pdfFiles, outputFilePath);

      // Upload the combined PDF to Cloudinary
      const combinedFileName = `${prefix}_combined`;
      const combinedUploadUrl = await uploadToCloudinary(outputFilePath, 'asfirj/combined', combinedFileName, '.pdf');

      // Clean up temporary files
      cleanUpFiles(allFiles);
      fs.unlink(outputFilePath, (err) => {
        if (err) console.error(`Error cleaning up combined file: ${outputFilePath}`, err);
      });

      // console.log('individualFiles', cloudinaryOriginalUrls);
      // console.log('pdfFiles', cloudinaryPdfUrls);
      // console.log('combinedFile', combinedUploadUrl);
      res.json({
        success: true,
        originalFiles: cloudinaryOriginalUrls,
        pdfFiles: cloudinaryPdfUrls,
        combinedFile: combinedUploadUrl
      });
    } catch (error) {
      console.error('Error processing files', error);
      res.status(500).json({ success: false, message: 'Error processing files' });
    }
  });
};

module.exports = CombinePDF;
