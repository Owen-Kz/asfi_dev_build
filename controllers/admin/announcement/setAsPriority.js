const dbPromise = require("../../../routes/dbPromise.config");

const SetAsPriority = async (req,res) =>{
    try{
       
    
        const announcementId = req.params.id; // Get the announcement ID from the URL

   
        const {priority} = req.body; 
        // Update the announcement in the database
        const result = await dbPromise.query(
            "UPDATE announcements SET priority = ? WHERE id = ?",
            [priority, announcementId]
        );

        if(priority == "1" || priority == 1 || priority == true || priority == "true"){
            // update all others to not priority

        await dbPromise.query(
                        "UPDATE announcements SET priority = ? WHERE id != ? AND priority = 1",
                        [0, announcementId]
                    );
        }

        if (result[0].affectedRows > 0) {
            return res.json({ success: true, message: "Announcement set as priority successfully." });
        } else {
            return res.status(404).json({ error: "Announcement not found." });
        }
    }catch(error){
        console.error("Error setting announcement as priority:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
   
}


module.exports = SetAsPriority;