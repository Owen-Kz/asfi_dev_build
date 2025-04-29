const axios = require('axios');
const { config } = require('dotenv');
const puppeteer = require("puppeteer");

async function getScholarProfile(name) {
    const response = await axios.get('https://serpapi.com/search.json?', {
        params: {
            engine: 'google_scholar',
            api_key: `${process.env.SERP_API_KEY}`,
            q: `${name}`
        }
    });
    return response.data;

    File: scholarScraper.js




 

}



module.exports = getScholarProfile