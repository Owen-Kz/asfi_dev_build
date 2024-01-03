const db = require("../routes/db.config");
// const DiscoveredUsers = [];

const getDiscover = async (req, res) => {
  if (req.user) {
    let DiscovereUSerData
    const usernameLogged = req.user.username;
    db.query("SELECT * FROM followers WHERE followerUsername =? ", [usernameLogged], async(err, followedUSER_DATA)=>{
        if(err) throw err
        // followedUSER_DATA.forEach(userDATA =>{
        //  const followedUSERNAME = userDATA.followingUsername
        // console.log(followedUSERNAME)
        // })
        let followedUsernamesArray
    

        if(followedUSER_DATA){
        followedUsernamesArray = await followedUSER_DATA.map((row) => row.followingUsername);

        
        followedUsernamesArray.forEach(user =>{
          db.query("SELECT * FROM user_info WHERE username !=? AND username !=?", [user, usernameLogged], async(err,data)=>{
            if(err) throw err
            DiscovereUSerData = await data.map((row) => row)
          })
        })
        }else{
          followedUsernamesArray = []
          DiscovereUSerData = []
        }
 
    db.query("SELECT * FROM user_info WHERE (acct_type = 'scholar_account' OR acct_type = 'instructor_account') AND username !=? ORDER BY first_name ", [usernameLogged, followedUsernamesArray], async(err, DiscoveredUsers)=>{
        if(err) throw err

        if(DiscoveredUsers[0]){
       res.json({ message: "userFollowsSome", DiscoverData: JSON.stringify(DiscoveredUsers) });

        }else{
         res.json({ message: "userFollowsSome", DiscoverData: "[]" });
        }
    })
})
 
  }
};  



module.exports = getDiscover;