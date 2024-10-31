// Initialize Firebase
importScripts('https://www.gstatic.com/firebasejs/9.17.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.17.2/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyD9glPHSmg43DC_UfYcqolmjf1UCUSrBPM",
    authDomain: "asfi-35ae2.firebaseapp.com",
    projectId: "asfi-35ae2",
    storageBucket: "asfi-35ae2.appspot.com",
    messagingSenderId: "664834133528",
    appId: "1:664834133528:web:ef137ded0f9b67a32bbd6d",
    measurementId: "G-32YRZWEG3P"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Messaging
const messaging = firebase.messaging();

// Optional: Add a background handler
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message: ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.data.icon, // Use the icon from the data payload
        data: {
            token: payload.data.token, // Include the token if needed for confirmation
            notificationId: payload.data.id // Include a unique ID for tracking
          }
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
// self.addEventListener('notificationclick', (event) => {
//     console.log("Notification clicked with URL:", event.notification.data.url);
//     event.notification.close(); // Close the notification
//     const targetUrl = event.notification.data?.url || 'https://your-default-url.com'; // Fallback URL if none provided
//     event.waitUntil(
//         clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
//             for (const client of clientList) {
//                 if (client.url === targetUrl && 'focus' in client) {
//                     return client.focus();
//                 }
//             }
//             if (clients.openWindow) {
//                 return clients.openWindow(targetUrl);
//             }
//         })
//     );
// });
// Handle notification click
self.addEventListener('notificationclick', function(event) {
    event.notification.close(); // Close the notification
    console.log("event", event)
    // Send a confirmation to your server
    fetch('/api/notification-received', {
        method: 'POST',
        body: JSON.stringify({
            token: event.notification.data.token, // Token or any identifying info
            notificationId: event.notification.data.id, // Track which notification was received
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Optionally navigate to the app or perform an action
    event.waitUntil(
        clients.openWindow("/") // Replace with your app URL
    );
});
