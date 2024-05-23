const db = require("../routes/db.config");

const render_vc = (req, res) => {
    if(req.user){
    const username__ = req.user.username
    db.query("SELECT * FROM user_info WHERE ?", [{username:username__}], async (err, result_v) =>{
        if(err) throw err
        if(result_v[0]){
            const firstname = result_v[0]["first_name"]
            const lastname = result_v[0]["last_name"]
            const profile_picture = result_v[0]["profile_picture"]
            const buffer = result_v[0]["buffer"]
        res.render("join_vc.ejs", {username:username__, firstname:firstname, lastname:lastname, profile_picture:profile_picture, buffer:buffer})
        }else{
            res.render("join_vc.ejs", {username:"visitor", profile_picture:"avatar.jpg"})
        }
    })
    }else{
        res.render("join_vc.ejs", {username:"visitor", profile_picture:"avatar.jpg"})
    }
}

module.exports = render_vc