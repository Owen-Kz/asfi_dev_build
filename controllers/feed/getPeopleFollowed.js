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
        const limit = 10; // Increased limit for better pagination
        const offset = (page - 1) * limit;

        // Fetch all followed users
        db.query("SELECT followingUsername FROM followers WHERE followerUsername = ? ORDER BY id DESC", 
        [String(username)], async (err, followers) => {
            if (err) {
                console.error(err);
                return res.json({ error: err.message });
            }

            if (!followers || followers.length === 0) {
                return res.json({ error: "No following" });
            }

            try {
                const followedUsers = followers.map(user => String(user.followingUsername).trim());

                // **Fetch Books, Podcasts, and Links in one batch query**
                const query = `
                    SELECT 'Book' AS type, book_title AS title, book_id AS id, date_uploaded AS timestamp, book_author AS person
                    FROM books WHERE book_author IN (${followedUsers.map(() => "?").join(",")})
                    
                    UNION ALL

                    SELECT 'Podcast' AS type, podcast_title AS title, buffer AS id, timestamp, podcast_owner AS person
                    FROM podcasts WHERE podcast_owner IN (${followedUsers.map(() => "?").join(",")})

                    UNION ALL

                    SELECT 'Publication Link' AS type, link_title AS title, link_href AS id, timestamp, link_owner AS person
                    FROM external_links WHERE link_owner IN (${followedUsers.map(() => "?").join(",")})

                    ORDER BY timestamp DESC
                `;

                db.query(query, [...followedUsers, ...followedUsers, ...followedUsers], async (err, results) => {
                    if (err) {
                        console.error(err);
                        return res.json({ error: err.message });
                    }

                    // **Find Emails for ASFIRJ Publications**
                    const emailPromises = followedUsers.map(person => findPersonEmail(person));
                    const emails = await Promise.all(emailPromises);

                    let ASFIRJ_Publications = [];
                    for (let i = 0; i < emails.length; i++) {
                        if (emails[i] !== "NoData" && emails[i].length > 0) {
                            const fullname = `${emails[i][0].first_name} ${emails[i][0].last_name}`;
                            
                            const publications = await findPublications(fullname);
                            ASFIRJ_Publications.push(...publications.map(publication => ({
                                type: "ASFIRJ Publication",
                                title: publication.manuscript_full_title || "Untitled Publication",
                                link: `https://asfirj.org/content/?sid=${publication.buffer}`,
                                timestamp: publication.date_uploaded,
                                person: emails[i][0].username
                            })));
                        }
                    }

                    // **Merge and paginate**
                    const allItems = [...results, ...ASFIRJ_Publications].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    const paginatedData = allItems.slice(offset, offset + limit);
                    const hasMore = offset + limit < allItems.length;

                    return res.json({ success: "Feed", data: paginatedData, hasMore });
                });

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
