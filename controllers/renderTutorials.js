const db = require("../routes/db.config");

const renderTutorialsPage = (req,res) =>{
    if(req.user){
        const username = req.user.usename
        const first_name = req.user.first_name
        const last_name = req.user.username
        const accountType = req.user.acct_type
    res.render("tutorials", {
        status: "logged",
        user: username,
        accountType: accountType,
        FirstName: first_name,
        LastName:last_name,
        UserName: username,
    })
}
}
module.exports = renderTutorialsPage 