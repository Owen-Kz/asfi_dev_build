const axios = require('axios');
const fs = require('fs');
const multer = require('multer');
const { PDFDocument: PDFLibDocument } = require('pdf-lib');
const path = require('path');
const FormData = require('form-data');


// Configure upload directory
const upload = multer({ dest: 'uploads/' }).fields([
  { name: 'manuscript_file', maxCount: 1 },
  { name: 'figures', maxCount: 10 },
  { name: 'supplementary_material', maxCount: 1 },
  { name: 'graphic_abstract', maxCount: 1 },
  { name: 'tables', maxCount: 10 }
]);
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
        if(response.data.success){
          fs.unlink(combinedFilePath,function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        });
          console.log(response.data)
        }else{
          console.log(response.data.message)
        }
    } catch (error) {
        console.error('Error uploading file', error);
    }
};

const CombinePDF = async (req, res) => {
    console.log("PDF Combine Started");

    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error uploading files' });
        }

        console.log("Files Received");

        try {
            const { manuscript_file, figures, supplementary_material, graphic_abstract, tables } = req.files;
            const combinedPdf = await PDFLibDocument.create();

            const addPagesFromPDF = async (pdfPath) => {
                const pdfBytes = fs.readFileSync(pdfPath);
                const pdfDoc = await PDFLibDocument.load(pdfBytes);
                const copiedPages = await combinedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                copiedPages.forEach((page) => combinedPdf.addPage(page));
            };

            await addPagesFromPDF(manuscript_file[0].path);

            if (figures) {
                for (const figure of figures) {
                    await addPagesFromPDF(figure.path);
                }
            }

            if (supplementary_material) {
                await addPagesFromPDF(supplementary_material[0].path);
            }

            if (graphic_abstract) {
                await addPagesFromPDF(graphic_abstract[0].path);
            }

            if (tables) {
                for (const table of tables) {
                    await addPagesFromPDF(table.path);
                }
            }

            const combinedPdfBytes = await combinedPdf.save();
            const combinedFilename = `combined-${Date.now()}.pdf`;
            const combinedFilePath = path.join('uploads', combinedFilename);
            fs.writeFileSync(combinedFilePath, combinedPdfBytes);

            console.log("File Combination Complete, ", combinedFilename);

            // Upload the combined PDF to the PHP server
            await uploadCombinedPDFToPHPServer(combinedFilePath, combinedFilename);

            res.json({ success: true, filename: combinedFilename });

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Error combining PDFs' });
        }
    });
};

module.exports = CombinePDF;