const videoConference = async (req,res)=> {
    // res.render("videoConferencing.ejs", {roomId: req.params.room})
    res.render("successful", {status:"Video conferencing page is still in the works", page:"https://d2cde6d4699c593101e7.vercel.app/"})
}

module.exports = videoConference 