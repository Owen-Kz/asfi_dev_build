const { countries } = require('country-data');

const getCurrencyFromCountryCode = async (code) => {
  const country = countries[code];
  
  return country ? country.currencies[0] : 'USD';
}



module.exports = getCurrencyFromCountryCode