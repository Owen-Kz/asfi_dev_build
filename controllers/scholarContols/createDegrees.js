const multer = require('multer');
const db = require('../../routes/db.config');
const upload = multer().none();  // Initialize multer
let SUCCESS_array = [];

const createDegrees = (req, res) => {
  if (req.user) {
    upload(req, res, function (err) {
        const username = req.user.username;
        const honoraryName = req.body;
        const DATAId = JSON.parse(JSON.stringify(honoraryName));

        // Function to get unique entries based on 'id'
        function getUniqueEntries(inputArray) {
          const uniqueEntries = {};

          for (const entry of inputArray) {
            const id = entry.id.trim();
            if (!uniqueEntries[id]) {
              uniqueEntries[id] = entry;
            }
          }

          return Object.values(uniqueEntries);
        }

        if(DATAId.length > 0){
        const uniqueData = getUniqueEntries(DATAId);

        function sendData(data_) {
            if(data_.successful == true){
          SUCCESS_array.push(data_);
          sendResponse(data_.successful);
        }else{
            sendResponse()
        }
        }

        function sendResponse(successQuery) {
            if(successQuery){
          if (SUCCESS_array.length > 0) {
            res.json({ message: 'Server Response' });
          } }
          else {
            res.json({message: 'Data Exists'});
          }
        }
    

        uniqueData.forEach(newDegree => {
          const degreeSubtext = newDegree.honoraryText;
          const degreeTitle = newDegree.honoraryName;

          db.query('SELECT * FROM honoraries WHERE honorary_type = ? AND additional_info = ? AND scholar_username = ?', [degreeTitle, degreeSubtext, username], async (err, data) => {
            if (err) throw err;
            if (data[0]) {
              sendData({ message: 'Degree Already Exists', successful:false });
            } else {
              db.query('INSERT INTO honoraries SET ?', [{ honorary_type: degreeTitle, additional_info: degreeSubtext, scholar_username: username }], async (err, insertion) => {
                if (err) throw err;
                sendData({ message: 'Degree Inserted', successful:true});
              });
            }
          });
        });

        // Check for success response after all database queries
        // sendResponse();
    }
    });
  } else {
    res.status(401).send('Unauthorized');
  }
}

module.exports = createDegrees;  // Apply multer middleware
