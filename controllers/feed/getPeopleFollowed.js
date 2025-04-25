const db = require("../../routes/db.config");
const findPublications = require("./findASFIRJPublications");
const findPersonEmail = require("./findpersonEmail");
const _ = require("lodash"); // Import lodash for shuffling

const getPeopleFollowed = async (req, res) => {
    try {
        const username = req.user.username;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = 10; 
        const offset = (page - 1) * limit;
        
        // Fetch followed users
        db.query("SELECT username FROM user_info WHERE 1", async (err, followers) => {
            if (err) return res.json({ error: err.message });
            if (!followers || followers.length === 0) return res.json({ error: "No following" });

            try {
                const followedUsers = followers.map(user => String(user.username).trim());

                // Fetch Books, Podcasts, and Links in one batch, using subqueries for ordering
                const query = `
                    (SELECT 'Book' AS type, book_title AS title, book_id AS id, date_uploaded AS timestamp, book_author AS person
                    FROM books WHERE book_author IN (${followedUsers.map(() => "?").join(",")}) 
                    ORDER BY date_uploaded DESC LIMIT 100)

                    UNION ALL

                    (SELECT 'Podcast' AS type, podcast_title AS title, buffer AS id, timestamp, podcast_owner AS person
                    FROM podcasts WHERE podcast_owner IN (${followedUsers.map(() => "?").join(",")}) 
                    ORDER BY timestamp DESC LIMIT 100)

                    UNION ALL

                    (SELECT 'Publication Link' AS type, link_title AS title, link_href AS id, timestamp, link_owner AS person
                    FROM external_links WHERE link_owner IN (${followedUsers.map(() => "?").join(",")}) 
                    ORDER BY timestamp DESC LIMIT 100)

                    ORDER BY timestamp DESC
                    LIMIT 100
                `;
                
                db.query(query, [...followedUsers, ...followedUsers, ...followedUsers], async (err, results) => {
                    if (err) return res.json({ error: err.message });

                    // Fetch ASFIRJ Publications
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
                                person: emails[i][0].username,
                                id: publication.buffer
                            })));
                 
                        }
                    }

                    // Merge all data and ensure newest is first
                    let allItems = [...results, ...ASFIRJ_Publications];

                    // Sort by timestamp DESC, then shuffle within same timestamp group
                    allItems = _.chain(allItems)
                        .sortBy("timestamp") // Sort by timestamp first
                        .reverse()
                        .groupBy("timestamp") // Group by timestamp
                        .map(group => _.shuffle(group)) // Shuffle within timestamp groups
                        .flatten()
                        .value();

                    // Paginate results
                    const paginatedData = allItems.slice(offset, offset + limit);
                    const hasMore = offset + limit < allItems.length;

                    return res.json({ success: "Feed", data: paginatedData, hasMore });
                });

            } catch (fetchError) {
                return res.json({ error: fetchError.message });
            }
        });
    } catch (error) {
        return res.json({ error: error.message });
    }
};

module.exports = getPeopleFollowed;
