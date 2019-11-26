importScripts('/__/firebase/7.2.3/firebase-app.js');
importScripts('/__/firebase/7.2.3/firebase-messaging.js');
importScripts('/__/firebase/init.js');

const messaging =  firebase.messaging();


// messaging.onMessage((payload) => {
//     console.log('Message received. ', payload);
//     // ...
//   });
// messaging.getToken().then((currentToken) => {
//     if (currentToken) {
//       sendTokenToServer(currentToken);
//       updateUIForPushEnabled(currentToken);
//     } else {
//       // Show permission request.
//       console.log('No Instance ID token available. Request permission to generate one.');
//       // Show permission UI.
//       updateUIForPushPermissionRequired();
//       setTokenSentToServer(false);
//     }
//   }).catch((err) => {
//     console.log('An error occurred while retrieving token. ', err);
//     showToken('Error retrieving Instance ID token. ', err);
//     setTokenSentToServer(false);
//   });
//   messaging.onTokenRefresh(() => {
//     messaging.getToken().then((refreshedToken) => {
//       console.log('Token refreshed.');
//       // Indicate that the new Instance ID token has not yet been sent to the
//       // app server.
//       setTokenSentToServer(false);
//       // Send Instance ID token to app server.
//       sendTokenToServer(refreshedToken);
//       // ...
//     }).catch((err) => {
//       console.log('Unable to retrieve refreshed token ', err);
//       showToken('Unable to retrieve refreshed token ', err);
//     });
//   });

