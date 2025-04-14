const db = require("../../routes/db.config");

const scholarSearchResults = (req,res) =>{
    const SearchParameter = req.params.scholarsearch
    const searchParamLower = SearchParameter.toLowerCase();
    
    db.query("SELECT * FROM user_info WHERE LOWER(username) COLLATE utf8mb4_general_ci LIKE LOWER(?) OR LOWER(first_name) COLLATE utf8mb4_general_ci LIKE LOWER(?) OR LOWER(last_name) COLLATE utf8mb4_general_ci LIKE LOWER(?) OR CONCAT(LOWER(first_name), ' ', LOWER(last_name)) COLLATE utf8mb4_general_ci LIKE LOWER(?) AND (acct_type = 'scholar_account' OR acct_type = 'instructor_account' OR acct_type = 'administrator') ORDER BY first_name", [`%${searchParamLower}%`, `%${searchParamLower}%`, `%${searchParamLower}%`, `%${searchParamLower}%`], async(err, data)=>{
        if(err) throw err
        if(data[0]){
            res.json({message:"success", ScholarsSearchData: JSON.stringify(data)})
        }else{
            res.json({message:"No data Match your search", ScholarsSearchData: "[]"})
        }
    })
}

module.exports = scholarSearchResults