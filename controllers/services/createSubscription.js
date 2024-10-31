const db = require("../../routes/db.config")

const createSubscription = async (token, user) =>{
    try{
    db.query("SELECT * FROM notification_subscriptions WHERE token = ? AND user = ?", [token, user], (err, data) =>{
        if(err){
            console.log(err)
        }else if(data[0]){
            console.log("DATA Already exists")
        }else{
            db.query("INSERT INTO notification_subscriptions SET ?",[{token:token, user:user}], async (err, result)=>{
                if(err){
                    console.log(err)
                }else{
                    if(user){
                    db.query("SELECT * FROM user_info WHERE id = ?",[user], async (error, find) =>{
                    if(error){
                        console.log(error)
                    }
                    if(find[0]){
                    db.query("UPDATE user_info SET ? WHERE username =?", [{notification_token:token}, find[0].username], async (er, user) =>{
                        if(er){
                            console.log(er)
                        }else{
                            console.log(user)
                        }
                    })
                    }

                    })
                    }
                    console.log(result)
                }
            })
        }
    })
}catch(error){
    console.log(error)
}
}

module.exports = createSubscription