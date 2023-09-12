const axios = require('axios');
const cheerio = require('cheerio');

async function fetchWebsiteData(urls) {
  const allData = [];

  for (const url of urls) {
    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);

      const ogTitle = $('meta[property="og:title"]').attr('content');
      const ogDescription = $('meta[property="og:description"]').attr('content');
      const ogImage = $('meta[property="og:image"]').attr('content');
      const ogUrl = $('meta[property="og:url"]').attr('content');

      if (ogTitle && ogDescription && ogImage && ogUrl) {
        const LINK_DATA_RECEIVED = {
          LINK_TITLE: ogTitle,
          LINK_DESCRIPTION: ogDescription,
          LINK_IMAGE: ogImage,
          LINK_URL: ogUrl,
        };
        allData.push(LINK_DATA_RECEIVED);
      } else {
        const LINK_DATA_RECEIVED = {
          LINK_TITLE: "External Publication Link",
          LINK_DESCRIPTION: "This is an external Link to an article",
          LINK_IMAGE: "https://img.freepik.com/free-vector/library-book-collection_1010-420.jpg?w=740&t=st=1693921589~exp=1693922189~hmac=edeb773869b509e95b34ab5c4e6153e84a6861681091247f14ad731080d91477",
          LINK_URL: url,
        };
        allData.push(LINK_DATA_RECEIVED);

        // console.log('No Open Graph metadata found for URL:', url);
      }
    } catch (error) {
      console.error('Error fetching data for URL', url, ':', error.message);
    }
  }

  return allData;
}

module.exports = fetchWebsiteData;
