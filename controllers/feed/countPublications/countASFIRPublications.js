const { config } = require("dotenv");
config();

const ASFIRJ_PUBLICATIONS = async (firstname, lastname) => {
    try {
        const userEmail = `${firstname} ${lastname}`;
        const url = `${process.env.ASFIRJ_DOMAIN}/external/countAuthorPublications.php?author=${encodeURIComponent(userEmail)}`;

        const response = await fetch(url, {
            method: "GET"
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch publications");
        }

        const responseData = await response.json();


        if (responseData.count === undefined || responseData.count === null) {
            throw new Error("No articles found");
        }

        return responseData.count;

    } catch (error) {
        console.error("Error fetching ASFIRJ publications:", error.message);
        return { error: error.message };
    }
};

module.exports = ASFIRJ_PUBLICATIONS;
