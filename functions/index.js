const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();


exports.sendNotifications = functions.database.ref('/notifications/{notificationId}').onWrite((change,context) => {

//   // Exit if data already created
  if (change.before.val()) {
    return;
  }

// //   // Exit when the data is deleted
  if (!change.after.exists()) {
    return;
  }
//   // Setup notification
//   console.log(change.val());
  const payload = {
    
    notification: {
      title: change.after.val().title,
      body: change.after.val().message,
      icon:change.after.val().icon,
      click_action: `https://pushnotif-a040e.firebaseapp.com/`
    }
  };
  console.info(payload);

  function cleanInvalidTokens(tokensWithKey, results) {
      const invalidTokens = [];

      results.forEach((result,i) => {
        
        if (!result.error) return;

        console.error("error with token: ", tokensWithKey[i].token);

        switch (result.error.code) {
          case "messaging/invalid-registration-token":
          case "messaging/registration-token-not-registered": 
            invalidTokens.push(admin.database().ref('/tokens').child(tokensWithKey[i].key).remove() );
            break;
          default:
            break;
        }

      });

      return Promise.all(invalidTokens);

  }
if (change.after.val().datepust === change.after.val().datecreate) {
  return admin.database().ref('/tokens').once('value').then(snapshot => {

    if(snapshot.val()){

      const data = snapshot.val();
      const tokens = [];
      const tokensWithKey = [];

      for (let key in data ) {
        console.log(data[key].token);
        tokens.push(data[key].token );
        tokensWithKey.push({
          token: data[key].token,
          key: key,
        });
      }
   
        console.log(tokens);
      return admin.messaging().sendToDevice(tokens,payload);

      // .then((response) => cleanInvalidTokens(tokensWithKey,response.results))
      // .then(() => admin.database().ref('/notifications').child(change.after.key).remove());
    }else{
      console.log("no token");
    }

  });

}
    // if ((timeStamp_create - timeStamp_pust)==0) {
     
});
