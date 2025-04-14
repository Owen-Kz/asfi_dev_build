const axios = require('axios');
function isPrivateIP(ip) {
    return (
      ip === '127.0.0.1' ||
      ip === '::1' ||
      ip.startsWith('192.168.') ||
      ip.startsWith('10.') ||
      ip.startsWith('172.')
    );
  }
const getLocationByIP = async (ip) => {
 
    
      
  try {
    if (isPrivateIP(ip)) {
        // Fallback to public IP for dev testing
        ip = '8.8.8.8';
      }
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching location:', error.message);
    return null;
  }
}

module.exports = getLocationByIP