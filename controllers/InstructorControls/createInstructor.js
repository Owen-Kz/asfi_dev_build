const db = require("../../routes/db.config");
const bcrypt = require("bcryptjs")

const createInstructor = async (req, res) => {

    if (req.body) {
       const { username, first_name, last_name, dob, email, phonenumber, nationality, gender, address, degree, password, degree_subtext,
        area_of_interest,
        highest_level_education,
        short_bio
    } = req.body
        // You can add database operations or other processing here
        // check if the user is a scholar 
        // console.log(req.body)

        db.query("SELECT * FROM user_info WHERE username =? AND (acct_type = 'scholar_account' OR acct_type = 'administrator')", [username], async(err,result_) =>{
            if(err) throw err
            if(result_[0]){
                db.query("UPDATE user_info SET ? WHERE ?", [{account_status:"2", bio:short_bio, home_address:address}, {username:username}], async (err, update) =>{
                    if(err) throw err

                    res.status(200).json({ message: "Your info has been recieved an Admin will contact you via your provided email to approve your request " });

                })
                
            }else{
                db.query("SELECT * FROM user_info WHERE username =? AND acct_type = 'instructor_account'",[username], async (err, exists)=>{
                    if(err) throw err
                    if(exists[0]){
                  res.status(200).json({ message: "This user is already an instructor Demo)" });

                    }else{
                        db.query("SELECT * FROM user_info WHERE username =? AND acct_type = 'user_account'", [username],async(err, user)=>{
                            if(err) throw err
                            if(user[0]){
                    res.status(200).json({ message: "You are not Eligible for this request " });            
                            }else{
                                const Npassword  = await bcrypt.hash(password, 8)

                                db.query("INSERT INTO user_info SET ?", [{first_name:first_name, last_name:last_name, username:username, email:email, phonenumber:phonenumber, nationality:nationality, gender:gender, home_address:address, password:Npassword, highest_level_of_education:highest_level_education, bio:short_bio, date_of_birth:dob, acct_type:'scholar_account', account_status:'2'}], async (err, insert) => {
                                    if(err) throw err
                                    db.query("INSERT INTO honoraries SET ?", [{honorary_type:degree, additional_info:degree_subtext, scholar_username:username }],async (err,degre)=>{
                                        if(err) throw err
                                        if(degre && insert){
                                           res.status(200).json({ message: "Your info has been recieved an Admin will contact you via your provided email to approve your request " });

                                        }
                                    })
                                })
                            }
                        })
                    }
                })
            }
        })

        // Send a response back to the client
        // res.status(200).json({ message: "Your info has been recieved an Admin will contact you via your provided email to approve your request " });
    } else {
        res.status(400).json({ message: "Bad request" }); // Handle invalid requests
    }
};

module.exports = createInstructor;
