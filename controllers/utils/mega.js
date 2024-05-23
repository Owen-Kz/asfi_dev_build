const Mega = require('mega');

// Your Mega.nz API credentials
const apiKey = 'YOUR_API_KEY';
const email = 'bensonmichael';
const password = '7xB:9TCk5E_xFsN';

// Initialize the Mega SDK
const mega = Mega({ email, password });

module.exports = mega;  
