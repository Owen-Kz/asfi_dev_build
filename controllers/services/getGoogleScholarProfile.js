const dbPromise = require("../../routes/dbPromise.config")
const getScholarProfile = require("../utils/googleSearchAPI")

const getGoogleProfile = async (req,res) =>{
    try{
    const personName = req.query.name
    const CheckifProfileExists = await dbPromise.query("SELECT * FROM google_scholar_profiles WHERE fullname = ?", [personName])
    
    
    if (CheckifProfileExists[0].length > 0) {
        const lastFetchRaw = CheckifProfileExists[0][0].last_fetch;
    const lastFetch = lastFetchRaw ? new Date(lastFetchRaw) : new Date(); // fallback to now if missing
    
    // Get date 2 months ago
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    
    // Compare
    const isWithinTwoMonths = lastFetch > twoMonthsAgo;
    if (isWithinTwoMonths) {
        // console.log("Profile Exists")
        return res.json(JSON.parse(CheckifProfileExists[0][0].profile_details))
    } else{
    const profile = await getScholarProfile(personName).then(async data =>{
    
        if(data.search_metadata.status === "Success" || data.status !== 429){

        const CreateNewScholarData = await dbPromise.query("INSERT INTO google_scholar_profiles (fullname, profile_details) VALUES (?, ?)", [personName, JSON.stringify(data)])
        if(CreateNewScholarData[0].affectedRows > 0){
            console.log("Profile Created")
        }
        }
        return res.json(data)}).catch(error =>{
        // console.log(error)
        return res.json({error:error})
    })
}
}else{
        const profile = await getScholarProfile(personName).then(async data =>{
        
            if(data.search_metadata.status === "Success" || data.status !== 429){
    
            const CreateNewScholarData = await dbPromise.query("INSERT INTO google_scholar_profiles (fullname, profile_details) VALUES (?, ?)", [personName, JSON.stringify(data)])
            if(CreateNewScholarData[0].affectedRows > 0){
                console.log("Profile Created")
            }
            }
            return res.json(data)}).catch(error =>{
            // console.log(error)
            return res.json({error:error})
        })
}
   
}catch(error){
    console.log(error)
    return res.json({error:error})
}
}

module.exports = getGoogleProfile