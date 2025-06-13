const dbPromise = require("../routes/dbPromise.config");
const countPublications = require("./feed/countPublications/countPublications");

const summation_FX = 5;

const find_info_for_SEO = async (req, res) => {
  try {
    if (!req.params.username) {
      return res.render("error.ejs", { status: "User Not Found" });
    }
    let loggedIn = false 
    let user_loggedIn = {}
    let UserLastName = ""
    let UserFirstname = ""


    if(req.user){
      loggedIn = true
      user_loggedIn = req.user
      UserLastName = req.user.last_name
      UserFirstname = req.user.first_name
    }
    
    const username_visitorQuery = async () => {
      const [data] = await dbPromise.query(
        "SELECT username FROM user_info WHERE unique_code = ? OR username = ?",
        [req.params.username, req.params.username]
      );
      if (!data[0]){
      throw new Error("invalidParameters");
      }else{
    
      return data[0].username;
      }
    };

    const username_visitor = await username_visitorQuery();
    const visitor = req.user ? req.user.username : "VALAK_SEO";
    const followStats = "Following";
    let socialLinksArray = [];

    // Run all queries in parallel using Promise.all
    const [
      [[followCountResult]],
      [[bookCountResult]],
      [[linkCountResult]],
      [[podcastCountResult]],
      [[tutorialCountResult]],
      [[honorariesCountResult]],
      [honorariesResult],
      [tutorialsResult],
      [userInfoResult],
      [socialLinksResult]
    ] = await Promise.all([
      dbPromise.query("SELECT COUNT(*) AS followersCount FROM followers WHERE followingUsername = ?", [username_visitor]),
      dbPromise.query("SELECT COUNT(*) AS bookCount FROM books WHERE book_author = ?", [username_visitor]),
      dbPromise.query("SELECT COUNT(*) AS linksCount FROM external_links WHERE link_owner = ?", [username_visitor]),
      dbPromise.query("SELECT COUNT(*) AS podcastCount FROM podcasts WHERE podcast_owner = ?", [username_visitor]),
      dbPromise.query("SELECT COUNT(*) AS tutorialCount FROM tutorials WHERE tutorial_owner = ?", [username_visitor]),
      dbPromise.query("SELECT COUNT(*) AS honorariesCount FROM honoraries WHERE scholar_username = ?", [username_visitor]),
      dbPromise.query("SELECT * FROM honoraries WHERE scholar_username = ?", [username_visitor]),
      dbPromise.query("SELECT * FROM tutorials WHERE tutorial_owner = ?", [username_visitor]),
      dbPromise.query("SELECT * FROM user_info WHERE username = ?", [username_visitor]),
      dbPromise.query("SELECT * FROM social_links WHERE link_owner = ?", [username_visitor])
    ]);

    const followsCount = followCountResult.followersCount;
    const BooksCountMain = bookCountResult.bookCount;
    const LinksCount = linkCountResult.linksCount;
    const BooksCount = Math.floor(BooksCountMain + LinksCount);
    const PodcastCount = podcastCountResult.podcastCount;
    const TutorialCount = tutorialCountResult.tutorialCount;
    const HonoraryCount = honorariesCountResult.honorariesCount;
    const honorayTitle = honorariesResult;
    const HonoraryText = "additional_info";
    const user = userInfoResult[0];

    const displayName = `${user.first_name} ${user.last_name}`;
    const TutorialFinal = tutorialsResult.map(tutorial => ({
      TutorialTitle: tutorial.tutorial_title,
      TutorialId: tutorial.tutorial_id,
      CourseID: tutorial.related_course_id,
      TutorialOwner: tutorial.tutorial_owner,
      TutorialDuration: tutorial.tutorial_duration,
      TutorialDescription: tutorial.tutorial_description,
      TutorialThumbnail: tutorial.tutorial_thumbnail,
      CourseLevel: tutorial.category,
      TutorialDate: tutorial.date_uploaded,
      TotalRelatedTutorials: TutorialCount,
      TutorialOwnerFullName: displayName,
      TutorialOwnerProfilePicture: user.profile_picture
    }));

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
    } else {
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
      });
    }
    
    const publicationsCount = await countPublications(username_visitor);
    res.render("profileForSEO", {
      searchName: displayName,
      personTitle: user.title || "Dr.",
      personProfilePicture: user.profile_picture,
      accountStatus: user.account_status,
      visitor,
      searchUSERNAME: user.username,
      summation_FX,
      followStatus: followStats,
      followersCount: followsCount,
      BooksSum: BooksCount,
      podcastSum: PodcastCount,
      Honors: HonoraryCount,
      honoraryTitle: honorayTitle,
      honorary_type: "honorary_type",
      HonoraryCount,
      cover_photo: user.cover_photo,
      accountType: "scholar_account",
      ProfileImage: "avatar.jpg",
      UserFirstname: "FirstName_visitor",
      UserLastName: "LastName_visitor",
      Email: "Email_visitor",
      UserName: visitor,
      EmailVisited: user.email,
      Bio: user.bio,
      Country: user.country_of_residence,
      area_of_interest: user.area_of_interest,
      sub_text: HonoraryText,
      TutorialsArray: JSON.stringify(TutorialFinal),
      tutorialSum: TutorialCount,
      SocialLinks: JSON.stringify(socialLinksArray),
      username_visitor,
      prefix: user.prefix,
      publicationsCount,
      loggedIn,
      user_loggedIn,
      UserLastName,
      UserFirstname
    });
  } catch (error) {
    console.error(error);
    res.json({ error });
  }
};

module.exports = find_info_for_SEO;
