const db = require("../routes/db.config");
// const DiscoveredUsers = [];

const getDiscover = async (req, res) => {
  if (req.user) {
let totalPages, totalCount;

    const  ITEMS_PER_PAGE = 20


// Get the current book page from the query parameter
let page = req.query.page || 1; 
const offset = (page - 1) * ITEMS_PER_PAGE; 

    let DiscovereUSerData
    const usernameLogged = req.user.username;
    // db.query("SELECT * FROM followers WHERE followerUsername =? ", [usernameLogged], async(err, followedUSER_DATA)=>{
    //     if(err) throw err
    //     // followedUSER_DATA.forEach(userDATA =>{
    //     //  const followedUSERNAME = userDATA.followingUsername
    //     // console.log(followedUSERNAME)
    //     // })
    //     let followedUsernamesArray
    

        // if(followedUSER_DATA){
        // followedUsernamesArray = await followedUSER_DATA.map((row) => row.followingUsername);

        
        // followedUsernamesArray.forEach(user =>{
        //   db.query("SELECT * FROM user_info WHERE username !=? AND username !=?", [user, usernameLogged], async(err,data)=>{
        //     if(err) throw err
        //     DiscovereUSerData = await data.map((row) => row)
        //   })
        // })
        // }else{
        //   followedUsernamesArray = []
        //   DiscovereUSerData = []
        // }
        
        db.query("SELECT COUNT(*) AS totalUsersCount from user_info WHERE (acct_type = 'scholar_account' OR acct_type = 'instructor_account' OR acct_type = 'administrator') AND username !=?",[usernameLogged], (err, total)=> {
          if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error: More info: Error Getting Links");
          }
          const CountTotal = JSON.stringify(total[0]["totalUsersCount"])

    db.query("SELECT * FROM user_info WHERE (acct_type = 'scholar_account' OR acct_type = 'instructor_account' OR acct_type = 'administrator') AND username !=? ORDER BY first_name LIMIT ? OFFSET ?", [usernameLogged, ITEMS_PER_PAGE, offset], async(err, DiscoveredUsers)=>{
        if(err) throw err
        if(DiscoveredUsers[0]){

          var Count = DiscoveredUsers.length

          totalCount = Math.ceil(Count / ITEMS_PER_PAGE);
          totalPages = Math.ceil(CountTotal / ITEMS_PER_PAGE);

       res.json({ message: "userFollowsSome", DiscoverData: JSON.stringify(DiscoveredUsers),totalPages: totalPages, currentPage:page });

        }else{
         res.json({ message: "userFollowsSome", DiscoverData: "[]", totalPages: 1, currentPage:page });
        }
    })
  })
// })
 
  }
};  



module.exports = getDiscover;