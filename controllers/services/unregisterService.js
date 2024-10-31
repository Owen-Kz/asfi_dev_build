const db = require("../../routes/db.config");

const unsubscribeNOtification =  async (req, res) => {
    const { token } = req.body;
    try {
        // Delete the token from the database (adjust to your DB setup)
       db.query("DELETE FROM notification_subscriptions WHERE token = ?", [token], async(err, deleted) =>{
        if(err){
            return res.status(500).send({error:true})
        }else{
            res.status(200).send({success: true})
        }
       })
        // res.status(200).send({ success: true });
    } catch (error) {
        console.error('Error removing token:', error);
        res.status(500).send({ error: 'Failed to delete token' });
    }
}

module.exports = unsubscribeNOtification