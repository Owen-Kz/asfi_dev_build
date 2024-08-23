const axios = require('axios');
const cheerio = require('cheerio');

async function fetchWebsiteData(urls) {
  const allData = [];
  for (const url of urls) {
    try {
      const response = await axios.get(url.link);
      if(response){
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
          LINK_URL: url.link,
        };
        allData.push(LINK_DATA_RECEIVED);
      } else {
        const LINK_DATA_RECEIVED = {
          LINK_TITLE: `${url.title}`,
          LINK_DESCRIPTION: "This is an external Link to an article / publication",
          LINK_IMAGE: "https://media.istockphoto.com/id/519476132/photo/edge-of-open-book-pages.jpg?s=612x612&w=0&k=20&c=NljbavTkSaHBX_0g9Za8tCebyTTXVLSGJuw2In-qco0=",
          LINK_URL: url.link,
        };
        allData.push(LINK_DATA_RECEIVED);

        console.log('No Open Graph metadata found for URL:', url);
      }
    }else{
      const LINK_DATA_RECEIVED = {
        LINK_TITLE: `${url.title}`,
        LINK_DESCRIPTION: "Could Not Fetch Publication / Broken Pipe",
        LINK_IMAGE: "https://asfischolar.org/files/images/ASFIScholar_Logo.png",
        LINK_URL: url.link,
      };
      allData.push(LINK_DATA_RECEIVED);
      // console.log("NoExternalDataFor ", url)
      // return null
    }
    } catch (error) {
      const LINK_DATA_RECEIVED = {
        LINK_TITLE: `${url.title}`,
        LINK_DESCRIPTION: "Could Not Fetch Publication / Broken Pipe",
        LINK_IMAGE: "https://asfischolar.org/files/images/ASFIScholar_Logo.png",
        LINK_URL: url.link,
      };
      allData.push(LINK_DATA_RECEIVED);
      // console.log('Error fetching data for URL', url, ':', error.message);
      // return []
      
      // return null
    }
  }

  return allData;
}

module.exports = fetchWebsiteData;
