const db = require("../routes/db.config");

const createWorkHistory = (req,res) =>{
    if(req.user){
        const username = req.user.username
        // res.json({message:req.body})
        const {work_history_name, work_organization, start_year, end_year} = req.body
        if(work_history_name){
        db.query("SELECT * FROM scholar_work_history WHERE work_history_name =?  AND work_organization =? AND work_owner_username =?",[work_history_name, work_organization, username], async (err,data)=>{
            if(err) throw err
            if(data[0]){
                res.json({message:"Data Already Exists"})
            }else{
                db.query("INSERT INTO scholar_work_history SET ?", [{work_history_name:work_history_name, work_organization:work_organization, start_year:start_year, end_year:end_year, work_owner_username:username}], async(err,insert) =>{
                    if(err) throw err
                    if(insert){
                    res.json({message: "Work History added Successfully"})
                    }else{
                        res.json({message:"Internal Server Error"})
                    }
                })
            }
        })
    }
    }
}

module.exports = createWorkHistory