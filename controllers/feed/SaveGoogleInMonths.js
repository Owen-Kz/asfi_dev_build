const dbPromise = require("../../routes/dbPromise.config");
const getAllSavedScholars = require("./SaveAllUsersGoogleProfile");

const TWO_MONTHS_MS = 1000 * 60 * 60 * 24 * 60;

const maybeRunGetAllSavedScholars = async () => {
    const [rows] = await dbPromise.query("SELECT last_run FROM scheduled_tasks WHERE task_name = 'getAllSavedScholars'");
    console.log(rows)
    const lastRun = rows.length > 0 ? new Date(rows[0].last_run) : null;
    const now = new Date();


    const shouldRun = !lastRun || (now - lastRun > TWO_MONTHS_MS);

    if (shouldRun) {
        const result = await getAllSavedScholars();
     
        if (result) {
            await dbPromise.query(`
                INSERT INTO scheduled_tasks (task_name, last_run)
                VALUES ('getAllSavedScholars', ?)
                ON DUPLICATE KEY UPDATE last_run = ?`,
                [now, now]
            );
            console.log("getAllSavedScholars ran successfully.");
        } else {
            console.error("getAllSavedScholars failed.");
        }
    } else {
        console.log("getAllSavedScholars skipped (ran recently).");
    }
};


module.exports = maybeRunGetAllSavedScholars