



// // public/js/sw.js
// self.addEventListener('push', function(event) {
//   const data = event.data.json();
//   const options = {
//     body: data.notification.body,
//     icon: '/files/images/ASFIScholar_Logo.png',
//     badge: '/files/images/ASFIScholar_Logo.png'
//   };

//   event.waitUntil(
//     self.registration.showNotification(data.notification.title, options)
//   );
// });

// self.addEventListener('notificationclick', function(event) {
//   event.notification.close();
//   event.waitUntil(
//     clients.openWindow('/')
//   );
// });
