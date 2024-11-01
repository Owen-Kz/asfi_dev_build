const getScholarProfile = require("../utils/googleSearchAPI")

const getGoogleProfile = async (req,res) =>{
    try{
        const personName = req.query.name
    const profile = await getScholarProfile(personName).then(data =>{
        // console.log(data)
        return res.json(data)}).catch(error =>{
        console.log(error)
        return res.json({error:error})
    })
}catch(error){
    return res.json({error:error})
}
}

module.exports = getGoogleProfile