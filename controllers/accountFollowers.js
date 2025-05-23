const db = require("../routes/db.config");

const AccountFollowers = async (req, res) => {
  if(req.user.username){
  const UserName = req.params.loggedUser;
//   const UserName = req.user.username

    db.query("SELECT * FROM user_info WHERE username =?",[UserName], async (err, data)=>{
    if(err) throw err
    var accountType
    if(data[0]){
    accountType = data[0].acct_type
    }else{
    // res.redirect("/login")
    accountType = "visitor_Account"
    }

  db.query(
    "SELECT COUNT(*) AS followingCount FROM followers WHERE ?",
    [{ followingUsername: UserName }],
    async (err, rows) => {
      if (err) throw err;
      var FollowingCount = JSON.stringify(rows[0]["followingCount"]);

      if (parseInt(FollowingCount) > 0) {
        db.query(
          "SELECT * FROM followers WHERE ?",
          [{ followingUsername: UserName }],
          async (err, result) => {
            if (err) throw err;
           
            const data = [];
            const RESULT_ = [];
            const promises = result.map((row) => {
              const FollowedAccount = row["followerUsername"];

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
                      firstname: firstname,
                      lastname: lastname,
                      username: username,
                      title: title,
                      profile_photo: profilePicture
                    });

                    RESULT_.push(life);

                    resolve();
                  }
                );
              });
            });

            Promise.all(promises)
              .then(() => {
                const dataJSON = JSON.stringify(data);
                res.render("accountFollowers.ejs", {
                  root: "./public",
                  FollowingCount: FollowingCount,
                  accountType: accountType,
                  dataJSON: dataJSON, // Pass the JSON string to the template
                });
              })
              .catch((error) => {
                // Handle error appropriately
                console.error(error);
                res.status(500).send("Internal Server Error");
              });
          }
        );
      } else {
        res.render("accountFollowers.ejs", {
          root: "./public",
          FollowingCount: FollowingCount,
          accountType: accountType,
          dataJSON: "[]",
        });
      }
})

    }
  );
};
}

module.exports = AccountFollowers;


