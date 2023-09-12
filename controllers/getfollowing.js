const db = require("../routes/db.config");
let FollowedUsers 

const getFollowing = async (req, res) => {
  if (req.user) {
    const usernameLogged = req.user.username;
    db.query("SELECT * FROM followers WHERE followerUsername =?", usernameLogged, (err, followingData) => {
      if (err) throw err;
      if (followingData[0]) {
        // Create an array of promises for querying user_info
        const userPromises = followingData.map((userFollowed) => {
          const userFollowedUsername = userFollowed.followingUsername;
          return new Promise((resolve, reject) => {
            db.query("SELECT * FROM user_info WHERE username =?", [userFollowedUsername], (err, userData) => {
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
            res.json({ message: "userFollowsSome", followingData: FollowedUsers });
          })
          .catch((err) => {
            // Handle errors here
            console.error(err);
            res.status(500).json({ message: "An error occurred" });
          });
      } else {
        res.json({ message: "noFollowing", followingData: [] });
      }
    });
  }
};

module.exports = getFollowing;
