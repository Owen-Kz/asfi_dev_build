const fetchWebsiteData = require("./utils/getLinkPreview")

const shareFrom = async (req, res) =>{
const url = req.query.url 

if(req.user){
if(url){
    const decodedURL = decodeURI(url);
    // const urlString = String(decodedURL);
    const LinkArray = []
    LinkArray.push({link:decodedURL})
    const WebData = await fetchWebsiteData(LinkArray);
    const Title = WebData[0].LINK_TITLE
    const linkURL = WebData[0].LINK_URL
    const LinkDescription = WebData[0].LINK_DESCRIPTION
    const LinkImage = WebData[0].LINK_IMAGE 


    res.render("share", { status :"logged", logger:"logged", user : req.user.username, ProfileImage:req.user.profile_picture, UserFirstname:req.user._first_name, UserLastName:req.user.lasT_name, Course:req.user.course_assigned, CourseYear:req.user.school_year, accountType:req.user.acct_type, Email:req.user.email, username:req.user.username, Username:req.user.username, UserName:req.user.username, submissionTitle:Title, linkUrl:linkURL})
}else{
    res.redirect("/home")
}
}else{
    res.render("loginExternal")
}
}

module.exports = shareFrom