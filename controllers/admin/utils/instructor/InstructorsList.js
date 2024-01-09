const db = require("../../../../routes/db.config");
let totalPages, totalInstructorssCount;

const InstructorsList = async(req,res) => {

   
    const Page = req.query.page
    const searchQuery = req.query.q
    const Filter = req.query.filter

    const  ITEMS_PER_PAGE_Instructorss = 6
    let pageInstructorss = req.query.page || 1; 
    const offsetInstructorss = (pageInstructorss - 1) * ITEMS_PER_PAGE_Instructorss; 
    let TotalInstructors
    db.query("SELECT COUNT(*) as Total_count FROM user_info WHERE acct_type = 'instructor_account'", async(err, data)=>{
        if(err) throw err
    TotalInstructors = data[0]["Total_count"]
    })
// Function to send REsponse to the client 
function SendResponse(dataArray){
    var InstructorssCount = dataArray.length
        
    totalInstructorssCount = InstructorssCount;
    totalPages = Math.ceil(TotalInstructors / ITEMS_PER_PAGE_Instructorss);

    res.json({status:"success",
    Instructors_list: JSON.stringify(dataArray), 
    currentPageInstructors:pageInstructorss,
    totalPagesInstructors: totalPages,
    totalInstructors: totalInstructorssCount
})
}

   if(!searchQuery && !Filter){
    db.query("SELECT * FROM user_info WHERE acct_type = 'instructor_account' ORDER BY id DESC LIMIT ? OFFSET ? ",
    [ITEMS_PER_PAGE_Instructorss, offsetInstructorss], async (err,data)=>{
        if(err) throw err
        SendResponse(data)
    })
    }

    if(searchQuery){
        db.query("SELECT * FROM user_info WHERE acct_type = 'instructor_account' AND (LOWER(first_name) COLLATE utf8mb4_general_ci LIKE LOWER(?) OR LOWER(last_name) COLLATE utf8mb4_general_ci LIKE LOWER(?) OR LOWER(title) COLLATE utf8mb4_general_ci LIKE LOWER(?)) ORDER BY id DESC", [`%${searchQuery}%`, `%${searchQuery}%`,  `%${searchQuery}%`], async(err,searchResult)=>{
            if(err) throw err 
            SendResponse(searchResult)
        })
    }

}

module.exports = InstructorsList