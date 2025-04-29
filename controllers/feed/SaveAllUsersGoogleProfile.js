const { config } = require("dotenv")
const dbPromise = require("../../routes/dbPromise.config")
config()

const getAllSavedScholars = async () => {
    try {
        const allScholars = await dbPromise.query("SELECT first_name, last_name FROM user_info ");
        const allScholarsList = allScholars[0];

        const allScholarsListWithFullName = allScholarsList.map((scholar) => ({
            fullname: `${scholar.first_name} ${scholar.last_name}`,
            first_name: scholar.first_name,
            last_name: scholar.last_name
        }));

        const results = await Promise.all(
            allScholarsListWithFullName.map(async (scholar) => {
                try {
                    const response = await fetch(`${process.env.CURRENT_SCHOLAR_DOMAIN}/findGoogleScholar?name=${encodeURIComponent(scholar.fullname)}`);
                    const responseData = await response.json();

                    if (!response.ok || responseData.error) {
                        throw new Error(responseData.error || "Failed to fetch scholar");
                    }

                    return true;
                } catch (err) {
                    // Optional: log or rethrow
                    console.error(`Failed to fetch for ${scholar.fullname}:`, err.message);
                    throw err; // To make Promise.all fail
                }
            })
        );

        return true;

    } catch (error) {
        console.error("getAllSavedScholars error:", error.message);
        return true;
    }
}

module.exports  = getAllSavedScholars