// firebaseConfig.js
const admin = require('firebase-admin');

// Replace with the path to your Firebase service account JSON file
const serviceAccount = require('../services/serviceConfig.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
