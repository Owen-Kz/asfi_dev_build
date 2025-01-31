const db = require("../routes/db.config");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// const upload = multer();
// const thumbnailsFolderPath = path.join(__dirname, "../../public/userUpload/spaceCovers");

// fs.access(thumbnailsFolderPath, fs.constants.W_OK, (err) => {
//   if (err) {
//     console.error(`The folder '${thumbnailsFolderPath}' is not writable:`, err);
//   } else {
//     console.log(`The folder '${thumbnailsFolderPath}' is writable`);
//   }
// });

// const thumbnailStorage = multer.diskStorage({
//   destination: thumbnailsFolderPath,
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1E9);
//     const fileName = file.originalname.split(".")[0];
//     const fileExtension = path.extname(file.originalname);
//     const thumbnailFile = uniqueSuffix + fileExtension;
//     cb(null, thumbnailFile);
//   },
// });

// const thumbnailUpload = multer({ storage: thumbnailStorage }).single("thumbnail");

function generateSpaceKey(){
    let part1 = Math.floor(100 + Math.random() * 900);  // Generates a 4-digit number
    let part2 = Math.floor(100 + Math.random() * 900);  // Generates another 4-digit number
    const uniqueCode = `${part1}-${part2}`;

    return uniqueCode
}

const createSpaces = async (req, res) =>{
  // Use the thumbnailUpload middleware first
//   thumbnailUpload(req, res, function (err) {
    // if (err) {
    //   return res.status(500).send(err);
    // }
    
    const {spaceTitle, shortDescription, Buffer, isPrivate} = req.body
    const FromPosters = req.query.fromPosters
    try{

    let isFromPoster = "false"
    if(FromPosters && FromPosters === "true"){
        isFromPoster = "true"
    }

    console.log("REQUESTBODY: ", req.body)

if(Buffer){
    db.query("SELECT * FROM spaces WHERE space_id =?",[Buffer], (err, spaceData)=>{
        if(err) throw err
        if(spaceData[0]){
            res.json({message:"This space already Exists"})
        }else{
            let privateKey = ""

            if(isPrivate === "true"){
                privateKey = generateSpaceKey()
            }

            db.query("INSERT INTO spaces SET ?", [{space_id:Buffer, space_focus:spaceTitle, space_description:shortDescription, isFromPoster:isFromPoster, space_passkey:privateKey, is_private:isPrivate}], (err, newSpace)=>{
                if(err) throw err
                if(newSpace){
                    res.json({success:"space_created", message: `Space Created Succesfully, Your space Key is ${privateKey}`, space_key:privateKey });
                }
            })
        }
    })

//   });
}else{
    res.json({ message: "An Error Occured" });

}
    }catch(error){
        console.log(error)
        return res.json({message:error.message})
    }
}; 


module.exports = createSpaces;
