const db = require("../../../routes/db.config");

let totalPages, totalScholarssCount;

const ScholarsList = async(req,res) => {
    const Page = req.query.page
    const searchQuery = req.query.q
    const Filter = req.query.filter

    const  ITEMS_PER_PAGE_Scholarss = 6
    let pageScholarss = req.query.page || 1; 
    const offsetScholarss = (pageScholarss - 1) * ITEMS_PER_PAGE_Scholarss; 
    let TotalScholars
    db.query("SELECT COUNT(*) as Total_count FROM user_info WHERE acct_type = 'scholar_account'", async(err, data)=>{
        if(err) throw err
    TotalScholars = data[0]["Total_count"]
    })
// Function to send REsponse to the client 
function SendResponse(dataArray){
    var ScholarssCount = dataArray.length
        
    totalScholarssCount = ScholarssCount;
    totalPages = Math.ceil(TotalScholars / ITEMS_PER_PAGE_Scholarss);

    res.json({status:"success",
    scholars_list: JSON.stringify(dataArray), 
    currentPageScholars:pageScholarss,
    totalPagesScholars: totalPages,
    adminBuffer:req.admin.buffer,
    totalScholars: totalScholarssCount
})
}

   if(!searchQuery && !Filter){
    db.query("SELECT * FROM user_info WHERE acct_type = 'scholar_account' ORDER BY joined_date DESC LIMIT ? OFFSET ? ",
    [ITEMS_PER_PAGE_Scholarss, offsetScholarss], async (err,data)=>{
        if(err) throw err
        SendResponse(data)
    })
    }

    if(searchQuery){
        db.query("SELECT * FROM user_info WHERE acct_type = 'scholar_account' AND (LOWER(first_name) COLLATE utf8mb4_general_ci LIKE LOWER(?) OR LOWER(last_name) COLLATE utf8mb4_general_ci LIKE LOWER(?) OR LOWER(title) COLLATE utf8mb4_general_ci LIKE LOWER(?)) ORDER BY id DESC", [`%${searchQuery}%`, `%${searchQuery}%`,  `%${searchQuery}%`], async(err,searchResult)=>{
            if(err) throw err 
            SendResponse(searchResult)
        })
    }

}

module.exports = ScholarsList