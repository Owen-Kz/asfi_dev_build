const formatTimezoneOffset = (timezone) => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    });
  
    const parts = formatter.formatToParts(now);
    const offset = parts.find(p => p.type === 'timeZoneName')?.value;
    return `(${offset}) ${timezone}`;
  }

 module.exports = formatTimezoneOffset