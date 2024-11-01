const axios = require('axios');
const { config } = require('dotenv');

async function getScholarProfile(name) {
    const response = await axios.get('https://serpapi.com/search.json?', {
        params: {
            engine: 'google_scholar',
            api_key: `${process.env.SERP_API_KEY}`,
            q: `${name}`
        }
    });
    return response.data;
}

// getScholarProfile()
//     .then(data => {
//         console.log(data)
//        return data
//     })
//     .catch(error => console.error(error));



module.exports = getScholarProfile