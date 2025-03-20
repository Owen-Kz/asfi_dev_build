const formatTime = (timestamp) => {
    // Check if the timestamp matches the format 'Mar, 20'
    const shortDatePattern = /^[A-Za-z]{3}, \d{1,2}$/;
    if (shortDatePattern.test(timestamp)) {
        return timestamp; // Return the timestamp as is
    }
    
    const time = new Date(timestamp);
    if (isNaN(time.getTime())) {
        return timestamp; // Return the original timestamp if it's invalid
    }
    
    const now = new Date();
    const diffMs = now - time; // Difference in milliseconds
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
        return "just now";
    } else if (diffMinutes < 60) {
        return `${diffMinutes} min${diffMinutes > 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else {
        // When it's more than 7 days, return the formatted date
        const options = { year: "numeric", month: "short", day: "numeric" };
        return time.toLocaleDateString(undefined, options); // Adjusts to local timezone and format
    }
};

export { formatTime };
