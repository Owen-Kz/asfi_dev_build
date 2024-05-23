const db = require("../../routes/db.config");

const AllCategories = async (req,res) =>{
    db.query("SELECT * FROM course_category WHERE 1", async (err, categoryData_)=>{
        if(err) throw err
        const CategoriesArrayMain = []
            categoryData_.forEach(element => {
            
                CategoriesArrayMain.push(element)
            });
            if(CategoriesArrayMain.length > 0){
                res.json({categoryData:JSON.stringify(CategoriesArrayMain)})
            }else{
            res.json({categoryData:"[]"})

            }
     
    })    
}

module.exports = AllCategories