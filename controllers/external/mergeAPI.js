const axios = require("axios");
const fs = require("fs");
const path = require("path");
const util = require("util");
const libre = require("libreoffice-convert");

const mergeAPI = async (req, res) => {
  try {
    console.log(req.body)
    const { a, files } = req.body;


        // Filter out empty or null file fields
        // const files = [
        //   data[0].manuscript_file,
        //   data[0].tables,
        //   data[0].figures,
        //   data[0].graphic_abstract,
        //   data[0].supplementary_material,
        // ].filter(file => file && file.trim() !== "");

        if (files.length === 0) {
          return res.json({ url: `/combineFiles?status=error&message=${encodeURIComponent("No valid files found")}&tag=Invalid Files` });
        }

        const tempDir = path.join(__dirname, "../temp");
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        let pdfFiles = [];
        let tempFiles = [];

        for (const fileUrl of files) {
          try {
            const fileExt = path.extname(fileUrl).toLowerCase();
            const filePath = path.join(tempDir, `temp_${Date.now()}${fileExt}`);
            const pdfPath = path.join(tempDir, `temp_${Date.now()}.pdf`);

            // Download the file
            const response = await axios({
              url: `${fileUrl}`,
              responseType: "arraybuffer",
              timeout: 15000,
            });

            if (!response.data || response.status !== 200) {
              console.error(`Failed to download: ${fileUrl} - Status: ${response.status}`);
              continue;
            }
       
            fs.writeFileSync(filePath, response.data);
            tempFiles.push(filePath);

            if (fileExt !== ".pdf") {
              const convertAsync = util.promisify(libre.convert);
              const pdfData = await convertAsync(fs.readFileSync(filePath), ".pdf", undefined);
              fs.writeFileSync(pdfPath, pdfData);
              pdfFiles.push(pdfPath);
              tempFiles.push(pdfPath);
            } else {
              pdfFiles.push(filePath);
            }
          } catch (error) {
            console.error(`Error downloading ${fileUrl}:`, error.message);
            continue;
          }
        }

        if (pdfFiles.length === 0) {
          return res.json({ url: `/combineFiles?status=error&message=${encodeURIComponent("No valid PDFs to merge")}&tag=Processing Failed` });
        }

        // ✅ If only one valid PDF exists, return it immediately
        if (pdfFiles.length === 1) {
          const singleFile = pdfFiles[0];
          console.log(singleFile)
        const fileName = singleFile.substring(singleFile.lastIndexOf("/") + 1);
        console.log(fileName)

          return res.json({
            url: `/combineFiles?status=success&message=${encodeURIComponent("Single file found")}&tag=File Ready&file=${encodeURIComponent(fileName)}`
          });
        }

        // Merge multiple PDFs
        const { default: PDFMerger } = await import("pdf-merger-js");
        const merger = new PDFMerger();

        for (const pdf of pdfFiles) {
          await merger.add(pdf);
        }

        const mergedFilePath = path.join(tempDir, `merged_${a}.pdf`);
        await merger.save(mergedFilePath);

        // Delete temporary files (except merged file)
        tempFiles.forEach((file) => {
          if (fs.existsSync(file)) fs.unlinkSync(file);
        });
        const fileName = mergedFilePath.substring(mergedFilePath.lastIndexOf("/") + 1);
        return res.json({
          url: `/combineFiles?status=success&message=${encodeURIComponent("Your files have been combined")}&tag=Files Combined Successfully&file=${encodeURIComponent(fileName)}`
        });
    
  } catch (error) {
    return res.json({ url: `/combineFiles?status=error&message=${encodeURIComponent(error.message)}&tag=Something Went Wrong` });
  }
};

module.exports = mergeAPI;
