const db = require("../routes/db.config")

const PlayPodcast = async (req,res) =>{
    const dummyUser = {
        username: "Sign in",
        first_name: "",
        last_name: "", 
        profile_picture: "https://res.cloudinary.com/dll8awuig/image/upload/v1705444097/dc69h8mggh01bvlvbowh.jpg",
        email: "",
        acct_type: "scholar_account"
        }
    
        const userData = req.user ? req.user : dummyUser
        if(userData.username){
    if(req.params["EncryptedFileName"]){
    const fileBufferString = req.params["EncryptedFileName"]
        const FileOwner = req.params["FileOwner"]

    db.query("SELECT * FROM podcasts WHERE podcast_owner =? AND buffer =? ", [FileOwner, fileBufferString], async (fileError, readingFile) => {
        if(fileError) throw fileError
        const podcast = readingFile[0]
        //  podcast_title = "podcast_title";
        //  podcast_duration = "podcast_duration"
        //  podcast_owner = "podcast_owner"
        //  podcast_owener_fullname = "podcast_owner_fullname"
        //  podcast_date_uploaded = "podcast_date"
        //  podcast_file = "fileID"
        //  bufferString = "buffer"


       const PodcastTitle = readingFile[0].podcast_title
    
       const PodcastOwner = readingFile[0].podcast_owner
       const PodcastOwnerFullname = readingFile[0].podcast_owner_fullname

        const PodcastDuration = readingFile[0].podcast_duration
        const PodcastDate = readingFile[0].podcast_date_uploaded 
        const Podcast_File = readingFile[0].fileID
        const podcastURL = readingFile[0].fileURL
        var BufferString = readingFile[0].buffer

    

    res.render("playing.ejs", { PodcastTitle:PodcastTitle, PodcastDuration:PodcastDuration, PodcastOwner:PodcastOwner, PodcastOwnerFullname:PodcastOwnerFullname, PodcastDate:PodcastDate,  Podcast_File:Podcast_File, BufferString:BufferString, podcastURL,     logger:"logged", user : userData.username, ProfileImage:userData.profile_picture, UserFirstname:userData.first_name, UserLastName:userData.last_name, Course:"Course", CourseYear:"CourseYear", accountType:userData.acct_type, UserName:userData.username, Email:userData.email, username:userData.username, Username:userData.username, UserName:userData.username})
    })
    }
}else{
    res.render("loginExternal")
}
}
 


module.exports = PlayPodcast