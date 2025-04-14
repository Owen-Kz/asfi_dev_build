const db = require("../../routes/db.config");
const getLocationByIP = require("../utils/getLocation");

const updateUserLocation  = async (req,res, id) =>{
    return new Promise(async (resolve, reject) =>{
        function getClientIP(req) {
            let ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
        
            // Clean IPv6 localhost
            if (ip === '::1') ip = '127.0.0.1';
          
            return ip;
          }
          
          const ip = getClientIP(req)
          const location = await getLocationByIP(ip)
           const UserLocation = location ?  location : {country:null}
            const country = UserLocation.country ? UserLocation.country : null
            db.query("SELECT * FROM user_info WHERE id = ?",[id], async (error, data) =>{
                if(error){
                    console.log(error)
                    resolve(false)
                }
                if((data[0].country_of_residence  === "N/A" || data[0].country_of_residence  === null) && country !== null){
                    db.query("UPDATE user_info SET country_of_residence  = ?, home_address = ? WHERE id = ?",[country, country, id], async (err, data) =>{
                        if(err){
                            console.log(err)
                            resolve(false)
                        }else{
                            resolve(true)
                        }
                    } )
                }else{
                    resolve(true)
                }
            })
    })
}


module.exports = updateUserLocation