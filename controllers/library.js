const db = require("../routes/db.config");
const fetchWebsiteData = require("./utils/getLinkPreview");


const library = async (req, res) => {

if(req.user){
  const username_new = req.user.username;


    res.render("library.ejs", {
    
      status: "logged",
    
      accountType: req.user.acct_type,
 
    });


}
};

module.exports = library;
