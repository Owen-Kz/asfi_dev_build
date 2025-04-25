const db = require("../../routes/db.config");


const UnfollowFromFeed = async (req, res) => {
  try{
    const { unfollowed} = req.body;
    const decodedFollowed = decodeURIComponent(unfollowed);
    const follower = req.user.username
    if(!req.cookies.userRegistered) return res.json({ status: "error", error: "Please Login to follow user"}); 
    // res.json({status:"loggedIn"})


    db.query("SELECT * FROM followers WHERE followerUsername = ? AND followingUsername = ?", [follower, decodedFollowed], async (ERR, followingScholar) => {

      followStats = "Follow"
      if(ERR) {
        console.log(ERR)
        throw ERR
      }
   
    
      if(followingScholar[0]) {
        followStats = "Following"
   
    db.query("DELETE FROM followers WHERE id = ?", [followingScholar[0].id], async (error, unfollowed_successfully) => {
        if(error) throw error
        else return res.json({success:"Unfollowed"})

    })
}else{
    res.json({success:"not following"})
}
})
  }catch (error) {
    console.error("Error in UnfollowFromFeed:", error);
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
}


module.exports = UnfollowFromFeed;