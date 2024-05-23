const db = require("../routes/db.config");
const find_info = require("./find_info");
// const find_info = require("./find_info");

const profile = async (req,res) => {
    // console.log(req.params["username"]);
    try {
        const result = await find_info(req,res)
    //     if(req.params["username"]){
    //     const username_visitor = req.params["username"];
    //     // console.log(username_visitor)
    //  }
    // res.render("profile", {root: "./public/directory/profile", searchName: displayName, personTitle: title, personProfilePicture: profilePicture, accountStatus:accountStatus, visitor:visitor, searchUSERNAME:searchNameUser, summation_FX :summation_FX, followStatus: "Follow"})
    }
    catch (error) {
        // if(error) return next()
        console.log(error)
    }

}


module.exports = profile


