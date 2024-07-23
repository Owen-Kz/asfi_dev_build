const axios = require('axios');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const FormData = require('form-data');
const { exec } = require('child_process');

const upload = multer({ dest: 'uploads/' }).fields([
    { name: 'manuscript_file', maxCount: 1 },
    { name: 'tracked_manuscript', maxCount: 1 },
    { name: 'figures', maxCount: 10 },
    { name: 'supplementary_material', maxCount: 1 },
    { name: 'graphic_abstract', maxCount: 1 },
    { name: 'tables', maxCount: 10 }
]);

const convertToPDF = async (inputFilePath, outputFilePath) => {
    // Implement conversion logic for various file types here
    // Example using LibreOffice for DOCX files:
    return new Promise((resolve, reject) => {
        const command = `libreoffice --headless --convert-to pdf --outdir ${path.dirname(outputFilePath)} ${inputFilePath}`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error converting ${inputFilePath} to PDF: ${stderr}`);
                reject(error);
            } else {
                console.log(`File converted to PDF: ${outputFilePath}`);
                resolve(outputFilePath);
            }
        });
    });
};

const convertFilesToPDF = async (files) => {
    const convertedFiles = [];

    for (const file of files) {
        const { path: inputFilePath, originalname } = file;
        const outputFilePath = `${inputFilePath}.pdf`;

        // Check if file is already a PDF
        if (path.extname(originalname).toLowerCase() === '.pdf') {
            convertedFiles.push(inputFilePath);
        } else {
            try {
                await convertToPDF(inputFilePath, outputFilePath);
                convertedFiles.push(outputFilePath);
            } catch (error) {
                console.error(`Error converting ${inputFilePath} to PDF: ${error.message}`);
            }
        }
    }

    return convertedFiles;
};

const mergePDFs = async (pdfPaths) => {
    const mergedPdf = await PDFDocument.create();

    for (const pdfPath of pdfPaths) {
        const pdfBytes = fs.readFileSync(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    return mergedPdfBytes;
};

const uploadCombinedPDFToPHPServer = async (combinedFilePath, combinedFilename) => {
    const form = new FormData();
    form.append('combined_file', fs.createReadStream(combinedFilePath));

    try {
        const response = await axios.post(process.env.ASFIRJ_SERVER, form, {
            headers: {
                ...form.getHeaders()
            }
        });

        console.log('File uploaded successfully', response.data);
        if (response.data.success) {
            // Delete combined file
            fs.unlink(combinedFilePath, function (err) {
                if (err) throw err;
                console.log('File deleted:', combinedFilePath);
            });
        } else {
            console.log('Upload failed:', response.data.message);
        }
    } catch (error) {
        console.error('Error uploading file', error);
    }
};

const cleanUpConvertedFiles = (files) => {
    files.forEach((filePath) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Error deleting file ${filePath}`, err);
            } else {
                console.log(`Deleted file: ${filePath}`);
            }
        });
    });
};

const CombinePDF = async (req, res) => {
    console.log("PDF Combine Started");

    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error uploading files' });
        }

        console.log("Files Received");

        try {
            const { manuscript_file, tracked_manuscript, figures, supplementary_material, graphic_abstract, tables } = req.files;

            // Convert all files to PDF
            const convertedFiles = await convertFilesToPDF([
                ...(manuscript_file || []),
                ...(tracked_manuscript || []),
                ...(figures || []),
                ...(supplementary_material || []),
                ...(graphic_abstract || []),
                ...(tables || [])
            ]);

            // Merge PDF files
            const combinedPdfBytes = await mergePDFs(convertedFiles);
            const combinedFilename = `combined-${Date.now()}.pdf`;
            const combinedFilePath = path.join('uploads', combinedFilename);
            fs.writeFileSync(combinedFilePath, combinedPdfBytes);

            console.log("File Combination Complete,", combinedFilename);

            // Upload the combined PDF to the PHP server
            await uploadCombinedPDFToPHPServer(combinedFilePath, combinedFilename);

            // Clean up temporary files
            cleanUpConvertedFiles(convertedFiles);

            res.json({ success: true, filename: combinedFilename });

        } catch (error) {
            console.error('Error combining PDFs', error);
            res.status(500).json({ success: false, message: 'Error combining PDFs' });
        }
    });
};

module.exports = CombinePDF;
