const db = require("../../routes/db.config");
const findPublications = require("./findASFIRJPublications");
const findBooks = require("./findBooks");
const findLinks = require("./findLinks");
const findPersonEmail = require("./findpersonEmail");
const findPodcasts = require("./findPodcasts");

const getPeopleFollowed = async (req, res) => {
    try {
        const username = req.user.username;

        db.query("SELECT * FROM followers WHERE followerUsername = ? ORDER BY id DESC LIMIT 10", [username], async (err, followers) => {
            if (err) {
                console.error(err);
                return res.json({ error: err.message });
            }

            if (!followers || followers.length === 0) {
                return res.json({ error: "No following" });
            }

            try {
                const dataPromises = followers.map(async (user) => {
                    const person = user.followingUsername;

                    const [AllBooks, AllPodcasts, AllLinks, personEmail] = await Promise.all([
                        findBooks(person),
                        findPodcasts(person),
                        findLinks(person),
                        findPersonEmail(person),
                    ]);

                    let ASFIRJ_Publications = [];
                    if (personEmail !== "NoData") {
                        ASFIRJ_Publications = await findPublications(personEmail[0].email);
                    }

                    if (!AllBooks.length && !AllPodcasts.length && !AllLinks.length && !ASFIRJ_Publications.length) {
                        console.log(`No data found for ${person}`);
                        return [];
                    }

                    return {
                        person,
                        books: AllBooks || [],
                        podcasts: AllPodcasts || [],
                        links: AllLinks || [],
                        publications: ASFIRJ_Publications || [],
                    };
                });

                const compiledData = (await Promise.all(dataPromises)).filter(entry => entry !== null);

                // console.log("COMPILEDDATA", JSON.stringify(compiledData, null, 2));
                return res.json({ success: "Feed", data: compiledData });
            } catch (fetchError) {
                console.error(fetchError);
                return res.json({ error: fetchError.message });
            }
        });
    } catch (error) {
        console.error(error);
        return res.json({ error: error.message });
    }
};

module.exports = getPeopleFollowed;
