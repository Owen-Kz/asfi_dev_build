const db = require("../../routes/db.config");

const createDegrees = (req,res) =>{
    if(req.user){
    const username = req.user.username
    // const {degreeTitle} = req.body
console.log(req.body)

    // db.query("SELECT * FROM honoraries WHERE honorary_type = ? AND scholar_username =?", [degreeTitle, username], async(err, data) =>{
    //     if(err) throw err
    //     if(data[0]){
    //     res.json({message :"Degree Already Exists"})
    //     }else{
    //         db.query("INSERT INTO honoraries SET ?", [{honorary_type:degreeTitle, scholar_username: username}], async(err, insertion) =>{
    //             if(err) throw err
    //             res.json({message:"Degree Inserted"})
    //         })
    //     }
    // })
    }
}

module.exports = createDegrees