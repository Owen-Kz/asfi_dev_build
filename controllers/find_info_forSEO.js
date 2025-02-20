const db = require("../routes/db.config");
const dbPromise = require("../routes/dbPromise.config");

const summation_FX = 5;

const find_info_for_SEO = async (req, res) => {
  try {
    if (req.params.username) {
      // const username_visitor = req.params.username;
      const username_visitorQuery = () =>{
        return new Promise((resolve, reject) =>{
          db.query("SELECT username FROM user_info WHERE unique_code = ?",[req.params.username], (err, data) =>{
            if(err){
              console.log(err)
              reject("invalidParameters")
            }else{
              resolve(data[0].username)
            }
          })
        })
      }
      const username_visitor = await username_visitorQuery()
   
      const visitor = req.user ? req.user.username : "VALAK_SEO";
      const followStats = "Following";
      let socialLinksArray = [];

      
      // Run all queries in parallel using Promise.all
      const [
        [followCountResult],
        [bookCountResult],
        [linkCountResult],
        [podcastCountResult],
        [tutorialCountResult],
        [honorariesCountResult],
        honorariesResult,
        tutorialsResult,
        [userInfoResult],
  
      ] = await Promise.all([
        dbPromise.query("SELECT COUNT(*) AS followersCount FROM followers WHERE followingUsername = ?", [username_visitor]),
        dbPromise.query("SELECT COUNT(*) AS bookCount FROM books WHERE book_author = ?", [username_visitor]),
        dbPromise.query("SELECT COUNT(*) AS linksCount FROM external_links WHERE link_owner = ?", [username_visitor]),
        dbPromise.query("SELECT COUNT(*) AS podcastCount FROM podcasts WHERE podcast_owner = ?", [username_visitor]),
        dbPromise.query("SELECT COUNT(*) AS tutorialCount FROM tutorials WHERE tutorial_owner = ?", [username_visitor]),
        dbPromise.query("SELECT COUNT(*) AS honorariesCount FROM honoraries WHERE scholar_username = ?", [username_visitor]),
        dbPromise.query("SELECT * FROM honoraries WHERE scholar_username = ?", [username_visitor]),
        dbPromise.query("SELECT * FROM tutorials WHERE tutorial_owner = ?", [username_visitor]),
        dbPromise.query("SELECT * FROM user_info WHERE username = ?", [username_visitor, username_visitor]),
        // dbPromise.query("SELECT * FROM social_links WHERE link_owner = ?", [username_visitor])
      ]);
      async function getSocialLinks() {
        try {
            // Assuming you are using the dbPromise instance for async/await
            const [rows] = await dbPromise.query("SELECT * FROM social_links");
            
            // `rows` now contains the actual data you need
            // console.log(rows);
            return rows;
        } catch (error) {
            console.error("Error fetching social links:", error);
            throw error;
        }
    }
    const socialLinksResult = await getSocialLinks()

      // Extract results
      const followsCount = followCountResult.followersCount;
      const BooksCountMain = bookCountResult.bookCount;
      const LinksCount = linkCountResult.linksCount;
      const BooksCount = Math.floor(BooksCountMain + LinksCount);
      const PodcastCount = podcastCountResult.podcastCount;
      const TutorialCount = tutorialCountResult.tutorialCount;
      const HonoraryCount = honorariesCountResult.honorariesCount;
      const honorayTitle = honorariesResult;
      var honorary_type = "honorary_type";
      const HonoraryText = "additional_info"
      const user = userInfoResult[0];

      var firstName = user['first_name'];
      var LastName = user['last_name'];
      const profilePicture = user['profile_picture'];
      const searchNameUser = user['username'];
      var accountStatus = user['account_status'];
      var title = user['title'];
      const acct_type = user["acct_type"]
      const cover_photo = user["cover_photo"]
      const EmailVisited = user["email"]
      var courseAssigned = user["course_assigned"]
      const Bio = user["bio"]
      const Country = user["country_of_residence"]
      const area_of_interest = user["area_of_interest"]
      const person_user_name = user["username"]
      const Prefix = user["prefix"]

      // Prepare social links
      if (socialLinksResult.length > 0) {
        socialLinksArray = socialLinksResult.map(linkItem => ({
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
        }));
      }else{
        socialLinksArray.push({
          LinkedIn: "",
          Facebook: "",
          Twitter: "",
          Instagram: "",
          YouTube: "",
          GoogleScholar: "",
          ResearchGate: "",
          Web_of_science: "",
          Scopius: "",
          Academia: "",
          Orchid: ""
        })
      }

      // Prepare tutorials
      const TutorialArrayMain = tutorialsResult.map(tutorial => ({
        TutorialTitle: tutorial.tutorial_title,
        TutorialId: tutorial.tutorial_id,
        CourseID: tutorial.related_course_id,
        TutorialOwner: tutorial.tutorial_owner,
        TutorialDuration: tutorial.tutorial_duration,
        TutorialDescription: tutorial.tutorial_description,
        TutorialThumbnail: tutorial.tutorial_thumbnail,
        CourseLevel: tutorial.category,
        TutorialDate: tutorial.date_uploaded,
        TotalRelatedTutorials: TutorialCount
      }));

      // User data for rendering
      const displayName = `${user.first_name} ${user.last_name}`;
      const TutorialFinal = TutorialArrayMain.map(dataItem => ({
        ...dataItem,
        TutorialOwnerFullName: displayName,
        TutorialOwnerProfilePicture: user.profile_picture
      }));
      let personTitleTemp = "Dr."
      if(title && title !== null && title !== ""){
        personTitleTemp = title
      }
      // Render the profile with all collected data
      res.render("profileForSEO", {
        searchName: displayName, personTitle: personTitleTemp, personProfilePicture: profilePicture, accountStatus:accountStatus, visitor:visitor,searchUSERNAME:searchNameUser, summation_FX :summation_FX, followStatus: followStats, followersCount:followsCount, BooksSum:BooksCount, podcastSum:PodcastCount,  Honors:HonoraryCount, honoraryTitle:honorayTitle, honorary_type:honorary_type, HonoraryCount:HonoraryCount, cover_photo:cover_photo,accountType: "scholar_account", ProfileImage:"avatar.jpg", UserFirstname:"FirstName_visitor", UserLastname:"LastName_visitor", Email:"Email_visitor", UserName:visitor, EmailVisited:EmailVisited, Bio:Bio, Country:Country, area_of_interest:area_of_interest, sub_text:HonoraryText, TutorialsArray:JSON.stringify(TutorialFinal), tutorialSum:TutorialCount,  SocialLinks:JSON.stringify(socialLinksArray), TutorialSum:TutorialCount,username_visitor:username_visitor, prefix:Prefix
      });
    } else {
      res.render("error.ejs", { status: "User Not Found" });
    }
  } catch (error) {
    console.log(error)
    res.json({ error });
  }
};

module.exports = find_info_for_SEO;
