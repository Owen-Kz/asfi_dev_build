var summation_FX = 5
const db = require("../routes/db.config");

const find_info = async (req,res) => {
    if(req.params["username"]){
    const username_visitor = req.params["username"];
    // console.log(username_visitor);
    // const username_visitor = "VC_of_lagos";

   if(username_visitor){     
        //   check if the user is logged in 
            if(req.user){
            var visitor = req.user.username;
            }
            else{
                var visitor = "VALAK_REHONDA";
                res.redirect("/login")
            }
    db.query("SELECT * FROM user_info WHERE username =?", [visitor], async (err, data) =>{
        if(err) throw err
      
        const FirstName_visitor = data[0]["first_name"]
        const LastName_visitor  = data[0]["last_name"]
        const accountType_visitor = data[0]["acct_type"]
        const profilePicture_visitor = data[0]["profile_picture"]
        const Email_visitor = data[0]["email"]
       


    db.query("SELECT * FROM followers WHERE followerUsername = ? AND followingUsername = ?", [visitor, username_visitor], async (ERR, followingScholar) => {
        followStats = "Follow"
        if(ERR) throw ERR
        if(followingScholar[0]) followStats = "Following"     
      
        // COUNT Scholar followers 
        db.query("SELECT COUNT(*) AS followersCount FROM followers WHERE followingUsername = ?", [username_visitor], async (err_C, followCount) => {
              if(err_C) throw err_C
              var followsCount =JSON.stringify(followCount[0]["followersCount"]);

            //   count books by SCholar
        db.query("SELECT COUNT(*) AS bookCount FROM books WHERE book_author = ?", [username_visitor], async (err_books, CountBooks) => {
        if(err_books) throw err_books
        var BooksCount =JSON.stringify(CountBooks[0]["bookCount"]);
        
           //   count podcasts by SCholar
           db.query("SELECT COUNT(*) AS podcastCount FROM podcasts WHERE podcast_owner = ?", [username_visitor], async (err_Podcast, CountPodcast) => {
            if(err_Podcast) throw err_Podcast
            var PodcastCount =JSON.stringify(CountPodcast[0]["podcastCount"]);

             //   count Tutorials by SCholar
           db.query("SELECT COUNT(*) AS tutorialCount FROM tutorials WHERE tutorial_owner = ?", [username_visitor], async (err_tutorial, Counttutorial) => {
            if(err_tutorial) throw err_tutorial
            const TutorialCount =JSON.stringify(Counttutorial[0]["tutorialCount"]);

                //   count Honoraris of scholars
           db.query("SELECT COUNT(*) AS honorariesCount FROM honoraries WHERE scholar_username = ?", [username_visitor], async (err_Honorary, CountHonorary) => {
            if(err_Honorary) throw err_Honorary
            var HonoraryCount =JSON.stringify(CountHonorary[0]["honorariesCount"]);

            // Select honoraries of scholar 
            db.query("SELECT * FROM honoraries WHERE scholar_username = ?", [username_visitor], async (err_select_honor, select_honor) => {
                if(err_select_honor) throw err_select_honor

              var honorayTitle = select_honor
              var honorary_type = "honorary_type";
              const HonoraryText = "additional_info"
          
            // for(var i=0; i<HonoraryCount; i++) { const HONOR = honorayTitle[i][honorary_type]; }
            
            // search for tutorials 
            const TutorialArrayMain = []
             // Select honoraries of scholar 
             return new Promise((resolve, reject) => {
                db.query("SELECT * FROM tutorials WHERE tutorial_owner = ?", [username_visitor], async (err_select_tutorial, select_tutorial) => {
                if(err_select_tutorial) throw err_select_tutorial
                if(TutorialCount > 0){
                select_tutorial.forEach(tutorial =>{
                    TutorialArrayMain.push({
                        TutorialTitle : tutorial.tutorial_title,
                        TutorialId: tutorial.tutorial_id,
                         CourseID : tutorial.related_course_id,
                         TutorialOwner : tutorial.tutorial_owner,
                         TutorialDuration : tutorial.tutorial_duration,
                         TutorialDescription : tutorial.tutorial_description,
                         TutorialThumbnail : tutorial.tutorial_thumbnail,
                         CourseLevel : tutorial.category,       
                         TutorialDate: tutorial.date_uploaded,   

                         TotalRelatedTutorials: TutorialCount          
                    })
                })
            }
            })
            resolve()

        db.query("SELECT * FROM user_info WHERE username = ?", [username_visitor], async (err, scholar_user) => {
            if(err) throw err
           if(scholar_user[0]) {
            // console.log(scholar_user[0])
          var firstName = scholar_user[0]['first_name'];
          var LastName = scholar_user[0]['last_name'];
          const profilePicture = scholar_user[0]['profile_picture'];
          const searchNameUser = scholar_user[0]['username'];
          var accountStatus = scholar_user[0]['account_status'];
          var title = scholar_user[0]['title'];
          const acct_type = scholar_user[0]["acct_type"]
          const cover_photo = scholar_user[0]["cover_photo"]
          const EmailVisited = scholar_user[0]["email"]
          var courseAssigned = scholar_user[0]["course_assigned"]
          const Bio = scholar_user[0]["bio"]
          const person_user_name = scholar_user[0]["username"]
          const displayName = firstName + "  " + LastName;

          const TutorialFinal = []

          TutorialArrayMain.forEach(dataItem => {
            TutorialFinal.push({
                TutorialTitle : dataItem.TutorialTitle ,
                TutorialId: dataItem. TutorialId,
                courseID : dataItem.CourseID,
                 TutorialOwner : dataItem.TutorialOwner,
                 TutorialDuration : dataItem.TutorialDuration,
                 TutorialDescription : dataItem.TutorialDescription,
                 TutoriaThumbnail : dataItem.TutorialThumbnail,
                 CourseLevel : dataItem.CourseLevel,       
                 TutorialDate: dataItem.TutorialDate,   
                 TotalRelatedTutorials: TutorialCount,
                 TutorialOwnerFullName :displayName,
                 TutorialOwnerProfilePicture : profilePicture,
              })
          })
          const socialLinksArray = []
          return new Promise((resolve, reject)=> {
            db.query("SELECT * FROM social_links WHERE link_owner =?",[username_visitor], async (err, link) =>{
                if(err) throw err
                if(link[0]){
                    link.forEach(linkItem =>{
                        socialLinksArray.push({
                            LinkedIn: linkItem.linked_in,
                            Facebook: linkItem.facebook,
                            Twitter: linkItem.twitter,
                            Instagram: linkItem.instagram,
                            YouTube: linkItem.youtube,
                            GoogleScholar: linkItem.google_scholar,
                            ResearchGate: linkItem.research_gate,
                            Web_of_science: linkItem.web_of_science,
                            Scopius: linkItem.scopus,
                            Academia: linkItem.academia,
                            Orchid: linkItem.orchid
                        })
                    
                    })
                }
            resolve()
        if(person_user_name == req.user.username){
            res.redirect("/settings")
        }else if(acct_type == "scholar_account"){
            res.render("profile", {root: "./public/directory/profile", searchName: displayName, personTitle: title, personProfilePicture: profilePicture, accountStatus:accountStatus, visitor:visitor,searchUSERNAME:searchNameUser, summation_FX :summation_FX, followStatus: followStats, followersCount:followsCount, BooksSum:BooksCount, podcastSum:PodcastCount,  Honors:HonoraryCount, honoraryTitle:honorayTitle, honorary_type:honorary_type, HonoraryCount:HonoraryCount, cover_photo:cover_photo,accountType: accountType_visitor, ProfileImage:profilePicture_visitor, UserFirstname:FirstName_visitor, UserLastname:LastName_visitor, Email:Email_visitor, UserName:visitor, EmailVisited:EmailVisited, Bio:Bio, sub_text:HonoraryText, TutorialsArray:JSON.stringify(TutorialFinal), tutorialSum:TutorialCount,  SocialLinks:JSON.stringify(socialLinksArray), TutorialSum:TutorialCount})
        }else if(acct_type == "user_account"){
            res.render("regularProfile", {root: "./public/directory/profile", searchName: displayName, personTitle: courseAssigned, personProfilePicture: profilePicture, accountStatus:accountStatus, visitor:visitor,searchUSERNAME:searchNameUser, summation_FX :summation_FX, followStatus: followStats, followersCount:followsCount, BooksSum:BooksCount, podcastSum:PodcastCount, Honors:HonoraryCount, honoraryTitle:honorayTitle, honorary_type:honorary_type, HonoraryCount:HonoraryCount,  cover_photo, accountType: accountType_visitor, ProfileImage:profilePicture_visitor, UserFirstname:FirstName_visitor,  TutorialsArray:JSON.stringify(TutorialFinal), UserLastname:LastName_visitor, Email:Email_visitor, UserName:visitor, EmailVisited:EmailVisited, Bio:Bio, SocialLinks:JSON.stringify(socialLinksArray), TutorialSum:TutorialCount})
        }else if(acct_type == "instructor_account"){
            res.render("instructProfile", {root: "./public/directory/profile", searchName: displayName, personTitle: title, personProfilePicture: profilePicture, accountStatus:accountStatus, visitor:visitor,searchUSERNAME:searchNameUser, summation_FX :summation_FX, followStatus: followStats, followersCount:followsCount, BooksSum:BooksCount, podcastSum:PodcastCount,  Honors:HonoraryCount, honoraryTitle:honorayTitle, honorary_type:honorary_type, HonoraryCount:HonoraryCount, cover_photo, accountType: accountType_visitor, ProfileImage:profilePicture_visitor, UserFirstname:FirstName_visitor, UserLastname:LastName_visitor, Email:Email_visitor, UserName:visitor, EmailVisited:EmailVisited, Bio:Bio, sub_text:HonoraryText, TutorialsArray:JSON.stringify(TutorialFinal), tutorialSum:TutorialCount,  SocialLinks:JSON.stringify(socialLinksArray), TutorialSum:TutorialCount})
        }
    }) 
})

         
    
} 
else {
    res.render("error.ejs", {status: "User Not Found"})
}
})
 
            
})
        })
    })
            })
        })
        })
    })
})

   })
}
}
}
module.exports = find_info