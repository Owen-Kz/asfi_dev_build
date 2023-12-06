const db = require("../routes/db.config")

const PlayPodcast = async (req,res) =>{

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
        var BufferString = readingFile[0].buffer

    

    res.render("playing.ejs", { PodcastTitle:PodcastTitle, PodcastDuration:PodcastDuration, PodcastOwner:PodcastOwner, PodcastOwnerFullname:PodcastOwnerFullname, PodcastDate:PodcastDate,  Podcast_File:Podcast_File, BufferString:BufferString})
    })
    }
}
 


module.exports = PlayPodcast