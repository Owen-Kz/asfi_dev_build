// public/js/main.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getMessaging, getToken, deleteToken  } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-messaging.js";

// Initialize Firebase
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
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Register the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
  .then((registration) => {
    console.log('Service Worker registered with scope:', registration.scope);

    if (registration.installing) {
      registration.installing.onstatechange = function () {
        if (registration.installing.state === 'activated') {
          console.log('Service Worker is activated.');
          // Now initialize Firebase messaging and get the token
          const messaging = getMessaging(app);
          subscribeUser(); 
        }
      };
    }
  })
  .catch((error) => {
    console.error('Service Worker registration failed:', error);
  });

}

// document.getElementById('enable-notifications').addEventListener('click', () => {
//     Notification.requestPermission().then(permission => {
//         if (permission === 'granted') {
//             console.log('Notification permission granted.');
//             subscribeUser();
//             document.getElementById('enable-notifications').style.display = "none";
//         } else {
//             console.log('Notification permission denied.');
//         }
//     });
// });
document.addEventListener("DOMContentLoaded", function() {
    if (Notification.permission === "granted") {
        document.getElementById("notification-toggle").checked = true;
        document.getElementById("notification-status").textContent = "Enabled";
    } else {
        document.getElementById("notification-status").textContent = "Disabled";
    }
});

document.getElementById("notification-toggle").addEventListener("change", function() {
    const statusText = document.getElementById("notification-status");
    if (this.checked) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log("Notification permission granted.");
                subscribeUser();
                statusText.textContent = "Enabled";
            } else {
                console.log("Notification permission denied.");
                this.checked = false; // Reset toggle if denied
            }
        });
    } else {
        console.log("Notifications Disabled");
        unsubscribeUser();
        statusText.textContent = "Disabled";
    }
});

async function subscribeUser() {
    try {
        const currentToken = await getToken(messaging, { vapidKey: 'BLwu_Ls5_vATPagRb0cDNrL8ambbwYUH5X8LNVtKqsDhf-USx-IJEg65dqBjAHlVqdjNMt7MXfvdDzBXI68wxMQ' });
        if (currentToken) {
            console.log('User is subscribed:', currentToken);

            // Send the token to the server
            await fetch('/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: currentToken }),
            });
        } else {
            console.log('No registration token available.');
        }
    } catch (err) {
        console.error('An error occurred while retrieving token.', err);
    }
}



// Function to handle token unregistration
async function unsubscribeUser() {
    try {
        const messaging = getMessaging();
        const currentToken = await getToken(messaging, { vapidKey: 'BLwu_Ls5_vATPagRb0cDNrL8ambbwYUH5X8LNVtKqsDhf-USx-IJEg65dqBjAHlVqdjNMt7MXfvdDzBXI68wxMQ' });
        if (currentToken) {
            // Delete token from Firebase
            await deleteToken(messaging);

            // Send request to server to delete the token
            await fetch('/unsubscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: currentToken })
            });
            console.log('Token deleted and unsubscribed successfully');
            
        } else {
            console.log('No registration token available');
        }
    } catch (error) {
        console.error('Error unsubscribing user:', error);
    }
}

// Attach a button or call unsubscribeUser() when needed
// document.getElementById('disable-notifications').addEventListener('click', unsubscribeUser);

// navigator.serviceWorker.getRegistration().then((registration) => {
//     if (registration) {
//         registration.unregister().then(() => {
//             console.log('Service worker unregistered');
//             unsubscribeUser(); // Remove token from database
//         });
//     }
// });
