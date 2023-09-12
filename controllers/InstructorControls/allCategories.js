const db = require("../../routes/db.config");

const AllCategories = async (req,res) =>{
    db.query("SELECT * FROM course_category WHERE 1", async (err, categoryData_)=>{
        if(err) throw err
        const CategoriesArrayMain = []
            categoryData_.forEach(element => {
            
                CategoriesArrayMain.push(element)
            });

            res.json({categoryData:JSON.stringify(CategoriesArrayMain)})
     
    })    
}

module.exports = AllCategories