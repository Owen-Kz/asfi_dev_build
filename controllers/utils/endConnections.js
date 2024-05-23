const db = require("../../routes/db.config");

const EndConnections = async (req,res) => { 
    db.end((err) => {
    if (err) {
        console.error('Error closing the connection:', err);
    } else {
        console.log('Connection closed.');
    }
});

}

module.exports = EndConnections

 