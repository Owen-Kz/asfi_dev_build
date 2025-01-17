const axios = require('axios');
const path = require('path');
const mime = require('mime'); // To get MIME type of the file

const openFile = async (req, res) => {
  const fileUrl = req.query.url;

  if (!fileUrl) {
    return res.status(400).send('File URL is required');
  }

  try {
    // Parse the file URL
    const parsedUrl = new URL(fileUrl);
    const filePath = parsedUrl.pathname;

    // Fetch file metadata with Cloudinary API authentication
    const response = await axios.head(`https://res.cloudinary.com${filePath}`, {
      auth: {
        username: process.env.CLOUDINARY_API_KEY, // Replace with your API Key
        password: process.env.CLOUDINARY_API_SECRET, // Replace with your API Secret
      },
    });

    const fileName = path.basename(parsedUrl.pathname);
    const contentType = response.headers['content-type'];

    // Check if the file is a PDF
    if (contentType === 'application/pdf') {
      // Fetch the file data for PDF display
      const pdfResponse = await axios.get(`https://res.cloudinary.com${filePath}`, {
        responseType: 'stream',
        auth: {
          username: process.env.CLOUDINARY_API_KEY,
          password: process.env.CLOUDINARY_API_SECRET,
        },
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
      pdfResponse.data.pipe(res);
    } else {
      // Redirect to the file URL for other formats
      res.redirect(fileUrl);
    }
  } catch (error) {
    console.error('Error handling file:', error.message);
    res.status(500).send('Error processing the file');
  }
};

module.exports = openFile;
