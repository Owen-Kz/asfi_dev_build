const db = require("../../routes/db.config");

const WorkHistoryResult = (req,res) =>{
    if(req.user){
        const searchUsername = req.params.username
        db.query("SELECT * FROM scholar_work_history WHERE work_owner_username =?", [searchUsername], async(err, data)=>{
            if(err) throw err
            if(data[0]){
                res.json({workArray:JSON.stringify(data)})
            }else{
                res.json({workArray:"[]"})
            }
        })
    }
}

module.exports = WorkHistoryResult