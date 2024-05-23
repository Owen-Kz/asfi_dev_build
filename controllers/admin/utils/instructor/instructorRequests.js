const db = require("../../../../routes/db.config");

const InstructorRequests = async (req,res) =>{
    const Page = req.query.page
    const searchQuery = req.query.q
    const Filter = req.query.filter

    const  ITEMS_PER_PAGE_Instructors = 10
    let pageInstructors = req.query.page || 1; 
    const offsetInstructors = (pageInstructors - 1) * ITEMS_PER_PAGE_Instructors; 
    let TotalInstructor
    let totalInstructorsCount
    db.query("SELECT COUNT(*) as Total_count FROM user_info WHERE account_status > 1 OR account_Status = '0'", async(err, data)=>{
        if(err) throw err
    TotalInstructor = data[0]["Total_count"]
    })
    
    function SendResponse(data){
        var InstructorsCount = data.length
        totalInstructorsCount = InstructorsCount;
        totalPages = Math.ceil(TotalInstructor / ITEMS_PER_PAGE_Instructors);
        res.json({status:"success",
        InstructorRequestList: JSON.stringify(data),
        currentPage:pageInstructors,
        totalPages: totalPages,
        totalInstructor: totalInstructorsCount
       })
    }

    if(!searchQuery && !Filter){
    db.query("SELECT * FROM user_info WHERE account_status > 1 OR account_Status = '0' ORDER BY id DESC LIMIT ? OFFSET ? ",
    [ITEMS_PER_PAGE_Instructors, offsetInstructors], async (err,data)=>{
        if(err) throw err
        SendResponse(data)     
    })
   }

   if(searchQuery){
    db.query("SELECT * FROM user_info WHERE (account_status > 1 OR account_Status = '0') AND (LOWER(first_name) COLLATE utf8mb4_general_ci LIKE LOWER(?) OR LOWER(last_name) COLLATE utf8mb4_general_ci LIKE LOWER(?) OR LOWER(title) COLLATE utf8mb4_general_ci LIKE LOWER(?)) ORDER BY id DESC", [`%${searchQuery}%`, `%${searchQuery}%`,  `%${searchQuery}%`], async(err,searchResult)=>{
        if(err) throw err 
        SendResponse(searchResult)
    })
   }


   if(Filter){
    db.query("SELECT * FROM user_info WHERE account_status =? ORDER BY id DESC", [Filter], async(err,searchResult)=>{
        if(err) throw err 
        SendResponse(searchResult)
    })
   }
}

module.exports = InstructorRequests