function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
  
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
  
    // return `${dayName}, ${monthName} ${day}, ${hours}:${minutes}`;
    return `${dayName}, ${hours}:${minutes}`;
  
  }

  export {
    formatTimestamp
  }