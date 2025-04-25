const db = require("../../routes/db.config");
const findPublications = require("./findASFIRJPublications");
const findPersonEmail = require("./findpersonEmail");
const _ = require("lodash");

const getPeopleFollowed = async (req, res) => {
    try {
        const username = req.user.username;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const search = req.query.q ? decodeURIComponent(req.query.q).trim() : "";
        const limit = 10; 
        const offset = (page - 1) * limit;
        
        // Fetch followed users
        db.query("SELECT username FROM user_info WHERE 1", async (err, followers) => {
            if (err) return res.json({ error: err.message });
            if (!followers || followers.length === 0) return res.json({ error: "No following" });

            try {
                const followedUsers = followers.map(user => String(user.username).trim());

                // Base query without search conditions
                let query = `
                    (SELECT 'Book' AS type, book_title AS title, book_id AS id, date_uploaded AS timestamp, book_author AS person
                    FROM books WHERE book_author IN (${followedUsers.map(() => "?").join(",")})
                    ${search ? "AND LOWER(book_title) LIKE ?" : ""}
                    ORDER BY date_uploaded DESC LIMIT 100)

                    UNION ALL

                    (SELECT 'Podcast' AS type, podcast_title AS title, buffer AS id, timestamp, podcast_owner AS person
                    FROM podcasts WHERE podcast_owner IN (${followedUsers.map(() => "?").join(",")})
                    ${search ? "AND LOWER(podcast_title) LIKE ?" : ""}
                    ORDER BY timestamp DESC LIMIT 100)

                    UNION ALL

                    (SELECT 'Publication Link' AS type, link_title AS title, link_href AS id, timestamp, link_owner AS person
                    FROM external_links WHERE link_owner IN (${followedUsers.map(() => "?").join(",")})
                    ${search ? "AND LOWER(link_title) LIKE ?" : ""}
                    ORDER BY timestamp DESC LIMIT 100)

                    ORDER BY timestamp DESC
                    LIMIT 100
                `;
                
                // Prepare parameters
                let params = [...followedUsers];
                if (search) params.push(`%${search.toLowerCase()}%`);
                
                params = params.concat([...followedUsers]);
                if (search) params.push(`%${search.toLowerCase()}%`);
                
                params = params.concat([...followedUsers]);
                if (search) params.push(`%${search.toLowerCase()}%`);

                db.query(query, params, async (err, results) => {
                    if (err) return res.json({ error: err.message });

                    // Fetch ASFIRJ Publications
                    const emailPromises = followedUsers.map(person => findPersonEmail(person));
                    const emails = await Promise.all(emailPromises);

                    let ASFIRJ_Publications = [];
                    for (let i = 0; i < emails.length; i++) {
                        if (emails[i] !== "NoData" && emails[i].length > 0) {
                            const fullname = `${emails[i][0].first_name} ${emails[i][0].last_name}`;
                            const publications = await findPublications(fullname);
                          
                            // Apply search filter to ASFIRJ publications if search term exists
                            const filteredPublications = search 
                                ? publications.filter(pub => 
                                    (pub.manuscript_full_title || "Untitled Publication").toLowerCase()
                                    .includes(search.toLowerCase()))
                                : publications;

                            ASFIRJ_Publications.push(...filteredPublications.map(publication => ({
                                type: "ASFIRJ Publication",
                                title: publication.manuscript_full_title || "Untitled Publication",
                                link: `https://asfirj.org/content/?sid=${publication.buffer}`,
                                timestamp: publication.date_uploaded,
                                person: emails[i][0].username,
                                id: publication.buffer
                            })));
                        }
                    }

                    // Merge all data
                    let allItems = [...results, ...ASFIRJ_Publications];

                    // Apply additional search filter if needed (as a fallback)
                    if (search) {
                        allItems = allItems.filter(item => 
                            item.title.toLowerCase().includes(search.toLowerCase())
                        );
                    }

                    // Sort by timestamp DESC, then shuffle within same timestamp group
                    allItems = _.chain(allItems)
                        .sortBy("timestamp")
                        .reverse()
                        .groupBy("timestamp")
                        .map(group => _.shuffle(group))
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