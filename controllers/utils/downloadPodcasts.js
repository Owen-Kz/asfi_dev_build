const fs = require('fs');
const axios = require('axios');

const baseURL = 'http://localhost:5000'; // Replace with your server's address and desired port

const instance = axios.create({
  baseURL: baseURL,
  // Other configuration options if needed
});

// Make a request
instance.get('/api/data')
  .then(response => {
    // Handle the response
    console.log(response.data);
  })
  .catch(error => {
    // Handle the error
    console.error(error);
  });

const download = (uri, filename, callback) => {
  axios
    .head(uri)
    .then((response) => {
      console.log('content-type:', response.headers['content-type']);
      console.log('content-length:', response.headers['content-length']);

      axios
        .get(uri, { responseType: 'stream' })
        .then((response) => {
          response.data.pipe(fs.createWriteStream(filename)).on('close', callback);
        })
        .catch((error) => {
          console.error('Error downloading file:', error);
        });
    })
    .catch((error) => {
      console.error('Error retrieving file information:', error);
    });
};

module.exports = { download };
