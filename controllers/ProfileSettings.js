const express = require("express")
const db = require("../routes/db.config")
const { CountryCodes } = require("validator/lib/isISO31661Alpha2")


const ProfileSettings = async (req,res) =>{
    if(req.user){
        const username__ = req.user.username
        const ProfileImage = []
        const FirstName = []
        const LastName = []
        const UserName = []
        const Email = []
        const PhoneNumber = []
        const CountryCode = []
        const ID = []

        db.query("SELECT * FROM user_info WHERE username = ?", [username__], async (error, result) => {
            if(error) throw error
            ProfileImage_ = result[0]["profile_picture"]
            Firstname = result[0]["first_name"]
            LastName_ = result[0]["last_name"]
            PhoneNumber_ = result[0]["phonenumber"]
            Email_ = result[0]["email"]
            Username_ = result[0]["username"]
            DoB = result[0]["date_of_birth"]
            Level_of_education = result[0]["highest_level_of_education"]
            Name_of_NOK = result[0]["name_of_next_of_kin"]
            Relationship_With_NOK = result[0]["relationship_with_nok"]
            NOK_email = result[0]["nok_email"]
            NOK_phone = result[0]["nok_phone_number"]
            Nationality = result[0]["nationality"]
            Country_Of_Residence = result[0]["country_of_residence"]
            State_of_residence = result[0]["state_of_residence"]
            City_OF_residence = result[0]["city_of_residence"]
            HomeAddress = result[0]["home_address"]
            PostalCode = result[0]["postal_code"]
            CourseAssigned = result[0]["course_assigned"]
            CourseId = result[0]["course_id"]
            SchoolYear = result[0]["school_year"]
            CourseDuration = result[0]["course_duration"]
            AccountType = result[0]["acct_type"]
            ProfileCover = result[0]["cover_photo"]
            Title = result[0]["title"]
            Bio = result[0]["bio"]

            ID_ = result[0]["ID"]
            CountryCode_ = result[0]["country_code"]

            ProfileImage.push(ProfileImage_)
            FirstName.push(Firstname)
            LastName.push(LastName_)
            PhoneNumber.push(PhoneNumber_)
            Email.push(Email_)
            UserName.push(Username_)
            CountryCode.push(CountryCode_)
            ID.push(ID_)
            const  LinksArray = []
            db.query("SELECT * FROM social_links WHERE link_owner =? ", [username__], async (err,linkTrue)=>{
                if(err) throw err
                if(linkTrue[0]){
                   LinksArray.push(linkTrue[0])
                }else{
                    LinksArray.push({
                    linked_in: "N/A",
                    twitter:"N/A",
                    facebook:"N/A",
                    instagram:"N/A",
                    youtube:"N/A",
                    google_scholar:"N/A",
                    web_of_science:"N/A",
                    research_gate:"N/A",
                    scopus:"N/A",
                    orchid:"N/A",
                    academia:"N/A"   
                    })
                }

            // console.log(LinksArray)
            const LinkedIn_Link = LinksArray[0].linked_in
            const TwitterLink = LinksArray[0].twitter
            const FacebookLink = LinksArray[0].facebook
            const Instagram_Lnk = LinksArray[0].instagram
            const YoutubeLink = LinksArray[0].youtube
            const GoogleScholarLink = LinksArray[0].google_scholar
            const WebOfScience_Link = LinksArray[0].web_of_science
            const ReasearchGate_Link= LinksArray[0].research_gate
            const scopusLink_ = LinksArray[0].scopus
            const orchid_link = LinksArray[0].orchid
            const Academia   = LinksArray[0].academia
            
            const FOLLOWING = []
            db.query("SELECT COUNT(*) AS followingCount FROM followers WHERE ?", [{followerUsername:username__}], async (NIL, NULL) => {
                if(NIL) throw NIL
                var FollowingCount =JSON.stringify(NULL[0]["followingCount"]);
                FOLLOWING.push(FollowingCount)
                // Render i logged in username belongs to regular user 
                if(AccountType == "user_account"){
                res.render("userProfile.ejs", {status:"loggedIn", root:"./public",UserFirstname:FirstName, UserLastName:LastName, ProfileImage:ProfileImage, FirstName:FirstName, LastName:LastName, Email:Email, PhoneNumber:PhoneNumber, UserName:UserName, CountryCode: CountryCode, validPoint:ID, DoB_:DoB, Level_of_education:Level_of_education, Relationship_With_NOK:Relationship_With_NOK, NOK_email:NOK_email, NOK_phone:NOK_phone, Nationality:Nationality, Country_Of_Residence:Country_Of_Residence,State_of_residence:State_of_residence, City_OF_residence:City_OF_residence, HomeAddress: HomeAddress, PostalCode: PostalCode, CourseAssigned__: CourseAssigned, CourseId:CourseId, SchoolYear:SchoolYear, CourseDuration__:CourseDuration,Following:FOLLOWING[0], accountType:AccountType, Course:CourseAssigned, CourseYear:SchoolYear, ProfileCover:ProfileCover, Username:UserName, Followers:0, bio:Bio, FacebookLink:FacebookLink, Twitter_link:TwitterLink, Instagram:Instagram_Lnk,
            research_Gate:ReasearchGate_Link, Scopus:scopusLink_, youtube:YoutubeLink, GoogleScholar: GoogleScholarLink,WebOfScience_Link:WebOfScience_Link, OrchidLink:orchid_link, LinkedIn_Link:LinkedIn_Link, Academia:Academia, Title:Title})
                }
                else if(AccountType == "scholar_account"){
 
        // Render if loggedin user name belongs to a scholar  
                res.render("scholarProfile.ejs", {status:"loggedIn", root:"./public", Username:UserName, ProfileImage:ProfileImage, FirstName:FirstName, LastName:LastName, UserFirstname:FirstName, UserLastName:LastName, Email:Email, PhoneNumber:PhoneNumber, UserName:UserName, CountryCode: CountryCode, validPoint:ID, DoB_:DoB, Level_of_education:Level_of_education, Relationship_With_NOK:Relationship_With_NOK, NOK_email:NOK_email, NOK_phone:NOK_phone, Nationality:Nationality, Country_Of_Residence:Country_Of_Residence,State_of_residence:State_of_residence, City_OF_residence:City_OF_residence, HomeAddress: HomeAddress, PostalCode: PostalCode, CourseAssigned__: CourseAssigned, CourseId:CourseId, SchoolYear:SchoolYear, CourseDuration__:CourseDuration, Following:FOLLOWING[0],accountType:AccountType, Course:CourseAssigned, CourseYear:SchoolYear,ProfileCover:ProfileCover, Followers:0, bio:Bio, FacebookLink:FacebookLink, Twitter_link:TwitterLink, Instagram:Instagram_Lnk,
            research_Gate:ReasearchGate_Link, Scopus:scopusLink_, youtube:YoutubeLink, GoogleScholar: GoogleScholarLink,WebOfScience_Link:WebOfScience_Link, OrchidLink:orchid_link, LinkedIn_Link:LinkedIn_Link, Academia:Academia, Title:Title})

                }
                // Render if the username belongs to an instructor 
                else if(AccountType == "instructor_account"){
                res.render("instructorProfile.ejs", {status:"loggedIn", root:"./public", Username:UserName, ProfileImage:ProfileImage, FirstName:FirstName,UserFirstname:FirstName, UserLastName:LastName, LastName:LastName, Email:Email, PhoneNumber:PhoneNumber, UserName:UserName, CountryCode: CountryCode, validPoint:ID, DoB_:DoB, Level_of_education:Level_of_education, Relationship_With_NOK:Relationship_With_NOK, NOK_email:NOK_email, NOK_phone:NOK_phone, Nationality:Nationality, Country_Of_Residence:Country_Of_Residence,State_of_residence:State_of_residence, City_OF_residence:City_OF_residence, HomeAddress: HomeAddress, PostalCode: PostalCode, CourseAssigned__: CourseAssigned, CourseId:CourseId, SchoolYear:SchoolYear, CourseDuration__:CourseDuration, FOLLOWING:FOLLOWING[0], accountType:AccountType,ProfileCover:ProfileCover, Followers:0, bio:Bio, FacebookLink:FacebookLink, Twitter_link:TwitterLink, Instagram:Instagram_Lnk,
            research_Gate:ReasearchGate_Link, Scopus:scopusLink_, youtube:YoutubeLink, GoogleScholar: GoogleScholarLink,WebOfScience_Link:WebOfScience_Link, OrchidLink:orchid_link, LinkedIn_Link:LinkedIn_Link, Academia:Academia, Title:Title})
             
                }
            })

    })
    })
    }
    else{
        // res.render("error.ejs", {status:"Please Login to continue", error:"Please Login to continue"})
    }
}


module.exports = ProfileSettings