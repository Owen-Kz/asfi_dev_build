const db = require("../../routes/db.config");

const getAllFollowing = async (username) => {

    const UserName = username;
  //   const UserName = req.user.username
  return new Promise((resolve, reject) =>{
  
    db.query(
      "SELECT COUNT(*) AS followingCount FROM followers WHERE ?",
      [{ followerUsername: UserName }],
      async (err, rows) => {
        if (err) throw err;
        var FollowingCount = JSON.stringify(rows[0]["followingCount"]);
  
        if (parseInt(FollowingCount) > 0) {
          db.query(
            "SELECT * FROM followers WHERE ?",
            [{ followerUsername: UserName }],
            async (err, result) => {
              if (err) {
              console.log(err)
            }
             
              const data = [];
              const RESULT_ = [];
              const promises = result.map((row) => {
                const FollowedAccount = row["followingUsername"];
  
                return new Promise((resolve, reject) => {
                  db.query(
                    "SELECT * FROM user_info WHERE ? AND (acct_type = 'scholar_account' OR acct_type = 'instructor_account' OR acct_type='administrator')",
                    [{ username: FollowedAccount }],
                    (err, life) => {
                      if (err) reject(err);
  
                      const firstname = life[0]["first_name"];
                      const lastname = life[0]["last_name"];
                      const username = life[0]["username"];
                      const title = life[0]["title"];
                      const profilePicture = life[0]["profile_picture"]
                      data.push({
                        first_name: firstname,
                        last_name: lastname,
                        username: username,
                        title: title,
                        profile_picture: profilePicture
                      });
  
                      RESULT_.push(life);

                      resolve(RESULT_);
                    }
                  );
                });
              });
              Promise.all(promises)
              .then(() => {
                const dataJSON = data;
                
                resolve(dataJSON)

              })
              .catch((error) => {
                // Handle error appropriately
                console.error(error);
                resolve([])
              });
            }
          );
        } else {
          resolve([])
        }
  })

      }
  
    );
  };

  module.exports = getAllFollowing