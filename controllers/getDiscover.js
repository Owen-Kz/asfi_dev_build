const db = require("../routes/db.config");
// const DiscoveredUsers = [];

const getDiscover = async (req, res) => {
  if (req.user) {
    const usernameLogged = req.user.username;
    db.query("SELECT * FROM followers WHERE followerUsername =? ", [usernameLogged], async(err, followedUSER_DATA)=>{
        if(err) throw err 
        // followedUSER_DATA.forEach(userDATA =>{
        //  const followedUSERNAME = userDATA.followingUsername
        // console.log(followedUSERNAME)
        // })
        let followedUsernamesArray 
        if(followedUSER_DATA){
        followedUsernamesArray = followedUSER_DATA.map((row) => row.followingUsername);
        }else{
          followedUsernamesArray = []
        }

        

    db.query("SELECT * FROM user_info WHERE (acct_type = 'scholar_account' OR acct_type = 'instructor_account') AND username !=? ORDER BY first_name ", [usernameLogged], async(err, DiscoveredUsers)=>{
        if(err) throw err

        if(DiscoveredUsers[0]){
       res.json({ message: "userFollowsSome", DiscoverData: DiscoveredUsers });

        }else{
         res.json({ message: "userFollowsSome", DiscoverData: [] });
        }
    })
})
 
  }
};




module.exports = getDiscover;
