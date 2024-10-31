const { config } = require("dotenv")

const sendBody = async (body) =>{
    try{
        console.log(body)
    return fetch(`${process.env.CURRENT_SCHOLAR_DOMAIN}/send-notification`, {
        method:"POST",
        body:JSON.stringify(body),
        headers:{
            "Content-type":"application/json"
        }
    }).then(res => res.json())
    .then(data =>{
        if(data){
            console.log(data)
            return {success:"data available", data:data}
        }
    })
}catch(error){
    console.log(error)
    return {error:error.message}
}
}


module.exports = sendBody