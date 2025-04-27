const db = require("../routes/db.config");

const getSpaces = (req, res) => {
  try {
    if (req.user) {
      const username = req.user.username;
      db.query(
        "SELECT * FROM spaces WHERE isFromPoster != ? ORDER BY space_focus ASC",
        ["true"],
        (err, spacesData) => {
          if (err) {
            console.error(err);
            return res.json({ error: "Database Error", spacesArray: [] });
          }

          if (spacesData.length > 0) {
            res.json({ message: "Spaces Found", spacesArray: spacesData });
          } else {
            res.json({ message: "No Spaces Found", spacesArray: [] });
          }
        }
      );
    } else {
      res.json({ error: "User Not Logged In", spacesArray: [] });
    }
  } catch (error) {
    console.error(error);
    res.json({ error: error.message, spacesArray: [] });
  }
};

module.exports = getSpaces;
