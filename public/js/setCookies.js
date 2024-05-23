// Set Cookie 
const hoursToKeep = 1;  // Desired duration in hours
const daysToKeep = hoursToKeep / 24;  // Convert hours to days
const expirationDays = daysToKeep > 0 ? daysToKeep : 1;  // Ensure a minimum of 1 day




const  SetCookies = function setCookie(name, value, daysToExpire) {
    const date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + value + '; ' + expires + '; path=/';
}

const GetCookie = function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null; // Cookie not found
}

const DeleteCookie = function deleteCookie(cookieName) {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    window.location.reload()
}


export{
    hoursToKeep,
    daysToKeep,
    expirationDays,
    SetCookies,
    GetCookie,
    DeleteCookie
}
