const db = require("../../routes/db.config");

const instructorReviews = (req,res) =>{
    if(req.user){
        const firstname = req.user.first_name
        const lastname = req.user.last_name
        const username = req.user.username
        const accountType = req.user.acct_type
        const profile_picture = req.user.profile_picture
        const email = req.user.email

    res.render("instructorReviews", {
        UserName: username, accountType:accountType, FirstName:firstname, LastName: lastname, ProfileImage: profile_picture, Email:email, UserFirstname:firstname, UserLastName: lastname, Username:username
    })
}
}

module.exports = instructorReviews