const db = require("../../routes/db.config");
const findPublications = require("./findASFIRJPublications");
const findPersonEmail = require("./findpersonEmail");
const _ = require("lodash");
const NodeCache = require("node-cache");
const feedCache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache

// Replace the complex UNION query with separate optimized queries
const getPeopleFollowed = async (req, res) => {
    try {
        const username = req.user.username;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const search = req.query.q ? decodeURIComponent(req.query.q).trim() : "";
        const limit = 10;
        const offset = (page - 1) * limit;
            const cacheKey = `feed_${req.user.username}_${req.query.q || ""}`;
    const cached = feedCache.get(cacheKey);
    
    if (cached && req.query.page === "1") {
        return res.json(cached);
    }

        // 1. Get followed users in a single optimized query
        const [followedUsers] = await db.promise().query(
            "SELECT username FROM user_info WHERE 1"
        );

        if (!followedUsers.length) return res.json({ error: "No following" });

        const usernames = followedUsers.map(u => u.username);
        
        // 2. Parallelize all database queries
        const [books, podcasts, links] = await Promise.all([
            db.promise().query(`
                SELECT 'Book' AS type, book_title AS title, book_id AS id, 
                       date_uploaded AS timestamp, book_author AS person
                FROM books 
                WHERE book_author IN (?)
                ${search ? "AND book_title LIKE ?" : ""}
                ORDER BY date_uploaded DESC 
                LIMIT 100
            `, [usernames, search ? `%${search}%` : null]),
            
            db.promise().query(`
                SELECT 'Podcast' AS type, podcast_title AS title, buffer AS id, 
                       timestamp, podcast_owner AS person
                FROM podcasts 
                WHERE podcast_owner IN (?)
                ${search ? "AND podcast_title LIKE ?" : ""}
                ORDER BY timestamp DESC 
                LIMIT 100
            `, [usernames, search ? `%${search}%` : null]),
            
            db.promise().query(`
                SELECT 'Publication Link' AS type, link_title AS title, link_href AS id, 
                       timestamp, link_owner AS person
                FROM external_links 
                WHERE link_owner IN (?)
                ${search ? "AND link_title LIKE ?" : ""}
                ORDER BY timestamp DESC 
                LIMIT 100
            `, [usernames, search ? `%${search}%` : null])
        ]);

        // 3. Optimize ASFIRJ publications fetching
        const emails = await Promise.all(
            usernames.map(person => findPersonEmail(person))
        );

        const publicationPromises = emails.map(async (email, i) => {
            if (email === "NoData" || !email.length) return [];
            
            const fullname = `${email[0].first_name} ${email[0].last_name}`;
            const publications = await findPublications(fullname);
            return search 
                ? publications.filter(pub => 
                    (pub.manuscript_full_title || "").toLowerCase()
                    .includes(search.toLowerCase()))
                : publications;
        });

        const ASFIRJ_Publications = (await Promise.all(publicationPromises))
            .flat()
            .map(pub => ({
                type: "ASFIRJ Publication",
                title: pub.manuscript_full_title || "Untitled Publication",
                link: `https://asfirj.org/content/?sid=${pub.buffer}`,
                timestamp: pub.date_uploaded,
                person: pub.corresponding_authors_email, // or another identifier
                id: pub.buffer
            }));

        // 4. Combine and sort results
        const allItems = [
            ...books[0], 
            ...podcasts[0], 
            ...links[0], 
            ...ASFIRJ_Publications
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // 5. Paginate
        const paginatedData = allItems.slice(offset, offset + limit);
        const hasMore = offset + limit < allItems.length;
        
   if (req.query.page === "1") {
        feedCache.set(cacheKey, {
            success: "Feed",
            data: paginatedData,
            hasMore
        });
    }

    return res.json({ success: "Feed", data: paginatedData, hasMore });

    } catch (error) {
        console.error("Feed error:", error);
        return res.json({ error: error.message });
    }
};

module.exports = getPeopleFollowed;