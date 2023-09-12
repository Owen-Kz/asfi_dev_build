const db = require("../routes/db.config")

const PlayPodcast = async (req,res) =>{

    if(req.params["EncryptedFileName"]){
        var fileBufferString = req.params["EncryptedFileName"]
        var FileOwner = req.params["FileOwner"]

    db.query("SELECT * FROM podcasts WHERE podcast_owner =? AND buffer =? ", [FileOwner, fileBufferString], async (fileError, readingFile) => {
        if(fileError) throw fileError
        var podcast = readingFile[0]
        var podcast_title = "podcast_title";
        var podcast_duration = "podcast_duration"
        var podcast_owner = "podcast_owner"
        var podcast_owener_fullname = "podcast_owner_fullname"
        var podcast_date_uploaded = "podcast_date"
        var podcast_file = "fileID"
        var bufferString = "buffer"


       var PodcastTitle = podcast[podcast_title]
       var PodcastOwner = podcast[podcast_owner]
        PodcastDuration = podcast[podcast_duration]
        PodcastDate = podcast[podcast_date_uploaded]
        Podcast_File = podcast[podcast_file]
        var BufferString = podcast[bufferString]
   


    res.render("playing.ejs", {root:"/public", PodcastTitle:PodcastTitle, PodcastDuration:PodcastDuration, PodcastOwner:PodcastOwner, PodcastDate:PodcastDate,  podcast_file:Podcast_File, BufferString:BufferString})
    })
    }
}



module.exports = PlayPodcast