const db = require("../routes/db.config");
let FollowedUsers 

const getFollowing = async (req, res) => {
  if (req.user) {
    let totalPagesFollowing, totalCount;

    const  ITEMS_PER_PAGE = 20

// Get the current book page from the query parameter
let page = req.params.page || 1; 
const offset = (page - 1) * ITEMS_PER_PAGE; 

    const usernameLogged = req.user.username;

    db.query("SELECT COUNT(*) AS totalFollowersCount from followers WHERE followerUsername =?",[usernameLogged], (err, total)=> {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error: More info: Error Getting Links");
      }
      const CountTotal = JSON.stringify(total[0]["totalFollowersCount"])

    db.query("SELECT * FROM followers WHERE followerUsername =? LIMIT ? OFFSET ?", [usernameLogged, ITEMS_PER_PAGE, offset], (err, followingData) => {
      if (err) throw err;
      if (followingData[0]) {
        var Count = followingData.length

        totalCount = Math.ceil(Count / ITEMS_PER_PAGE);
        totalPagesFollowing = Math.ceil(CountTotal / ITEMS_PER_PAGE);

        // Create an array of promises for querying user_info
        const userPromises = followingData.map((userFollowed) => {
          const userFollowedUsername = userFollowed.followingUsername;
          return new Promise((resolve, reject) => {
          
            db.query("SELECT * FROM user_info WHERE username =? ORDER BY first_name ", [userFollowedUsername], (err, userData) => {
              if (err) reject(err);
              resolve(userData);
            });
        
          });
        });
        
        // Wait for all the promises to resolve
        Promise.all(userPromises)
          .then((userDataArray) => {
            FollowedUsers = []
            FollowedUsers.push(...userDataArray);


            res.json({ message: "userFollowsSome", followingData: JSON.stringify(FollowedUsers),totalPagesFollowing: totalPagesFollowing, currentPageFollowing:page });
          })
          .catch((err) => {
            // Handle errors here
            console.error(err);
            res.status(500).json({ message: "An error occurred" });
          });
      } else {
        res.json({ message: "noFollowing", followingData: "[]", totalPagesFollowing: totalPagesFollowing, currentPageFollowing:page });
      }
    });
  })
  }
};

module.exports = getFollowing;
