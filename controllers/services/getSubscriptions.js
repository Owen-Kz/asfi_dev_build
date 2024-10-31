const db = require("../../routes/db.config");

const getSubscriptions = async (user) => {
    console.log(user)
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM notification_subscriptions WHERE token = ?",[user], (err, data) => {
            if (err) {
                console.log(err);
                reject(err); // Reject the promise with the error
            } else {
                console.log(data);
                resolve(data); // Resolve the promise with the fetched data
            }
        });
    });
};

module.exports = getSubscriptions;
