const createSubscription = require('./createSubscription');
const admin = require('./firebaseConfig');
const getSubscriptions = require('./getSubscriptions');
const { getIPAddress } = require('./userIPAddress');

// Store subscriptions here (use a database in a real application)
let subscriptions = [];

// Example route to handle subscription and send notification
const pushNotification = async (req, res) => {
  const subscription = req.body;
  const ipAddress = getIPAddress()
  const user = req.user?.id ? req.user.id : ipAddress
  // Store the subscription token
  await createSubscription(subscription.token, user);
  res.status(201).json({ message: 'Subscription stored' });
};

const sendNotification = async (req, res) => {
  const { title, body, token } = req.body;

  subscriptions = await getSubscriptions(token);
  console.log('Fetched subscriptions:', subscriptions);
  
  const tokens = subscriptions.map(sub => sub.token).filter(token => token);
  const ids = subscriptions.map(sub => sub.id).filter(id => id);
  console.log("Tokens", tokens)
  if (tokens.length === 0) {
      return res.status(400).json({ error: 'No valid tokens provided' });
  }
  
  // Map each subscription to its corresponding token and id
  const sendPromises = subscriptions.map(sub => {
      const message = {
          notification: {
              title,
              body,
          },
          data: {
              url: 'https://asfischolar.org', // This URL will open when the notification is clicked
              icon: 'https://asfischolar.org/files/images/ASFIScholar_Logo.png', // Update this to your logo's URL
              id: sub.id.toString() // Pass the unique id associated with this token
          },
          token: sub.token // Send to one token at a time
      };
  
      return admin.messaging().send(message);
  });

Promise.all(sendPromises)
      .then(responses => {
          res.json({ success: true, results: responses });
      })
      .catch(error => {
          console.error(error);
          res.status(500).json({ error: 'Failed to send notification', details: error });
      });
};


const NotificationReceived = async (req, res) => {
  try{
  // const { token, notificationId } = req.body;
  console.log("RECEIVED RESPONSE", req.body)

  // Handle the confirmation (e.g., log it, update a database, etc.)
  // console.log(`Notification ${notificationId} received by device with token: ${token}`);

  res.status(200).json({ success: true });
  }catch(error){
    console.log(error)
  }
}

module.exports = {
  pushNotification,
  sendNotification,
  NotificationReceived
};
