const os = require("os")

var hostname = os.hostname();
var NET = os.networkInterfaces();
var TOTAL_MEM = os.totalmem();
var TMP_DIR = os.tmpdir()
var osType = os.type()

function getIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'IP not found';
}


module.exports = {
    hostname,
    NET,
    TOTAL_MEM,
    TMP_DIR,
    osType,
    getIPAddress
}