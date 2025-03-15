const db = require("../../routes/db.config");
const findPublications = require("./findASFIRJPublications");
const findBooks = require("./findBooks");
const findLinks = require("./findLinks");
const findPersonEmail = require("./findpersonEmail");
const findPodcasts = require("./findPodcasts");

const getPeopleFollowed = async (req, res) => {
    try {
        const username = req.user.username;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = 3; // Number of items per page
        const offset = (page - 1) * limit;

        // Fetch all followed users
        db.query("SELECT * FROM followers WHERE followerUsername = ? ORDER BY id DESC", [String(username)], async (err, followers) => {
            if (err) {
                console.error(err);
                return res.json({ error: err.message });
            }

            if (!followers || followers.length === 0) {
                return res.json({ error: "No following" });
            }

            try {
                const dataPromises = followers.map(async (user) => {
                    const person = String(user.followingUsername || "").trim();


                    const [AllBooks, AllPodcasts, AllLinks, personEmail] = await Promise.all([
                        findBooks(person),
                        findPodcasts(person),
                        findLinks(person),
                        findPersonEmail(person),
                    ]);

                    let ASFIRJ_Publications = [];
                   
                    if (personEmail !== "NoData") {
                        const fullname = `${personEmail[0].first_name} ${personEmail[0].last_name}`;
                        ASFIRJ_Publications = await findPublications(fullname);
                    }

                    // Combine all items into one array
                    const combinedItems = [
                        ...AllBooks.map(book => ({
                            type: "Book",
                            title: book.book_title || "Untitled Book",
                            link: `/library/b/${book.book_id}`,
                            timestamp: book.datePublished,
                            person
                        })),
                        ...AllPodcasts.map(podcast => ({
                            type: "Podcast",
                            title: podcast.podcast_title || "Untitled Podcast",
                            link: `/podcasts/${podcast.buffer}/${podcast.file_owner}`,
                            timestamp: podcast.timestamp,
                            person
                        })),
                        ...AllLinks.map(link => ({
                            type: "Publication Link",
                            title: link.link_title || "Untitled Link",
                            link: link.link_href,
                            timestamp: link.timestamp,
                            person
                        })),
                        ...ASFIRJ_Publications.map(publication => ({
                            type: "ASFIRJ Publication",
                            title: publication.manuscript_full_title || "Untitled Publication",
                            link: `https://asfirj.org/content/?sid=${publication.buffer}`,
                            timestamp: publication.date_uploaded,
                            person
                        }))
                    ];

                    return combinedItems;
                });

                // Wait for all users' data to be retrieved and flatten the array
                const compiledData = (await Promise.all(dataPromises)).flat();

                // Apply pagination on the combined data
                const paginatedData = compiledData.slice(offset, offset + limit);
                const hasMore = offset + limit < compiledData.length; // Check if there are more items

                return res.json({ success: "Feed", data: paginatedData, hasMore });
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
