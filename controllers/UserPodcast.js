const db = require("../routes/db.config");

const ITEMS_PER_PAGE_PODCASTS = 6; // Number of podcasts per page
let  PODCAST_ARRAY = []

const find_info = async (req,res) => {
    if(req.user){
    const visitor = req.user.username;
    const pagePodcasts = req.query.page || 1; // Get the current podcast page from the query parameter
    if(req.query.page ){
      PODCAST_ARRAY  = []
    }
    // Calculate the offset for podcasts
    const offsetPodcasts = (pagePodcasts - 1) * ITEMS_PER_PAGE_PODCASTS;
  
    // Initialize variables to store data
    let userData, podcasts, podcastCount, totalPagesPodcasts;


    if(req.params["username"]){
   
    const username_visitor = req.params["username"];

   if(username_visitor){     
        //   count Podcasts of scholars
        db.query("SELECT COUNT(*) AS podcastCount FROM podcasts WHERE podcast_owner = ?", [username_visitor], async (err_Honorary, CountHonorary) => {
        if(err_Honorary) throw err_Honorary
        var PodcastCount =JSON.stringify(CountHonorary[0]["podcastCount"]);

        // Select honoraries of scholar 
        db.query("SELECT * FROM podcasts WHERE podcast_owner = ? ORDER BY id", [username_visitor], async (err_POD, POD) => {
            if(err_POD) throw err_POD
            console.log(POD.length)
            if(POD.length < 0){
            // POD.forEach(podcast_item =>{
            //     PODCAST_ARRAY.push(podcast_item)
            // })
            }



        db.query("SELECT * FROM user_info WHERE username = ? AND acct_type = 'scholar_account' OR acct_type = 'instructor_account' ORDER BY id DESC", [username_visitor], async (err, scholar_user) => {
            if(err) throw err
           if(scholar_user[0]) {
            // console.log(scholar_user[0])
          var firstName = scholar_user[0]['firstname'];
          var LastName = scholar_user[0]['lastname'];
          var account_type = scholar_user[0]['acct_type']
          var profilePicture = scholar_user[0]['profile_picture'];
          const searchNameUser = scholar_user[0]['username'];
          var accountStatus = scholar_user[0]['account_status'];
          var podcast_owner_fullname = scholar_user[0]["podcast_owner_fullname"]
          var title = scholar_user[0]['title'];
          const displayName = firstName + "  " + LastName;

      
        res.render("podcast", {root: "./public/podcast", searchName: displayName, personTitle: title, personProfilePicture: profilePicture, accountStatus:accountStatus, visitor:visitor,searchUSERNAME:searchNameUser, accountType:account_type, PODCAST_ARRAY:PODCAST_ARRAY,      currentPage: pagePodcasts,
        totalPages: totalPagesPodcasts, podcast_owner_fullname: podcast_owner_fullname,  PodcastCount: podcastCount}) 
          
    
} 
else {
    res.render("error.ejs", {status: "Invalid URL"})
}
 
            
})
        })
    })

}
} else{ //   count Podcasts of scholars
    db.query("SELECT * FROM user_info WHERE username =?", [visitor], (err,result) => {
        if(err) throw err
       const  UserFirstname = result[0]["first_name"]
        const UserLastname = result[0]["last_name"]
        const ProfileImage = result[0]["profile_picture"]
        const Course = result[0]["course_assigned"]
        const accountType = result[0]["acct_type"]
        const Email = result[0]["email"]

          db.query("SELECT COUNT(*) AS pdtCount FROM podcasts WHERE 1 ",
          [ITEMS_PER_PAGE_PODCASTS, offsetPodcasts], async (err_PDT, CountPDT) => {
            if(err_PDT) throw err_PDT
            var PodcastCount =JSON.stringify(CountPDT[0]["pdtCount"]);

             totalPagesPodcasts = Math.ceil(PodcastCount / ITEMS_PER_PAGE_PODCASTS);
            
            // Select honoraries of scholar 
            db.query("SELECT * FROM podcasts WHERE 1 ORDER BY id DESC LIMIT ? OFFSET ?",
        [ITEMS_PER_PAGE_PODCASTS, offsetPodcasts], async (err_POD, POD_m) => {
                if(err_POD) throw err_POD
                var podcast = POD_m

                var podcast_owner_fullname = "podcast_owner_fullname"
                
            if(PODCAST_ARRAY < ITEMS_PER_PAGE_PODCASTS){

                POD_m.forEach(podcast_item =>{
                    PODCAST_ARRAY.push(podcast_item)
                })
             }

                
            res.render("podcast.ejs", {root: "./public", PODCAST_ARRAY:PODCAST_ARRAY, podcast:podcast, PodcastCount:PodcastCount,  accountType:accountType, userName:visitor, UserName:visitor, username:visitor, firstName:UserFirstname, FirstName: UserFirstname, firstname:UserFirstname, lastname:UserLastname, LastName:UserLastname, Lastname:UserLastname, lastName:UserLastname, Email:Email, profilePicture:ProfileImage, ProfilePicture:ProfileImage, profile_photo:ProfileImage, profile_picture:ProfileImage, podcast_owner_fullname:podcast_owner_fullname, podcastCount: podcastCount,
            currentPage: pagePodcasts,
            totalPages: totalPagesPodcasts})
    })


        })
  
          })
}
   
}

}
module.exports = find_info
