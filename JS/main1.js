
{
    // const FIREBASE_AUTH = firebase.auth();
    const FIREBASE_MESSAGING = firebase.messaging();
    const FIREBASE_DATABASE = firebase.database();
    
    // const signInButton = document.getElementById('sign-in');
    // const signOutButton = document.getElementById('sign-out');
    // const subscribeButton = document.getElementById('subscribe');
    // const unsubscribeButton = document.getElementById('unsubscribe');
    const sendNotifiForm = document.getElementById('send-notification-form');
    // const signInSubButton = document.getElementById('signin-sub');
   
    // signInSubButton.addEventListener('click',signInAndSub);
    // signInButton.addEventListener('click', signIn);
    // signOutButton.addEventListener('click',signOut);
    // subscribeButton.addEventListener('click',subscribeToNotifi);
    // unsubscribeButton.addEventListener('click',unsubscribeNotifi);
    sendNotifiForm.addEventListener('submit',sendNotification);
 

    FIREBASE_MESSAGING.usePublicVapidKey("BG9TQX87n40XCXw9FtEnbtxgVsGw4Z_npuejD1B2zLm1E8rFlICCtu2qK2xyYmL9LoLw8W5ICGwu2XWFlp_w2z4");

    // FIREBASE_AUTH.onAuthStateChanged(handleAuthStateChanged);
    // FIREBASE_MESSAGING.onTokenRefresh(handleTokenRefresh);
    
    // $(document).ready(function(permission){
    //     console.log(permission);
    //     if (permission == 'granted') {
    //         $('#tallModal').modal('hidden');
    //     }else{
    //         $('#tallModal').modal('show');
    //     }
               
    //   });
      
    // function signInAndSub(){
    //     console.log("ok");
    //     signIn();
    //     subscribeToNotifi();
    // }
    // function signIn() {
    //     FIREBASE_AUTH.signInAnonymously().catch(function(error) {
    //         // Handle Errors here.
    //         var errorCode = error.code;
    //         var errorMessage = error.message;
    //         // ...
    //       });
    // }

    // function signOut() {
    //     console.log('unsub')
    //     unsubscribeNotifi();

        
    // }

    // function subscribeToNotifi() {
        
    //     FIREBASE_MESSAGING.requestPermission()
    //     .then(() => handleTokenRefresh())
    //     // .then(() => checkSubcribe())
    //     .catch((err) => {
    //      console.log("error getting permission :(");
    //     });

    //  }

    // function handleTokenRefresh() {
    //     return FIREBASE_MESSAGING.getToken()
    //     .then((token) => {
    //         FIREBASE_DATABASE.ref('/tokens').push({
    //             token: token,
    //             uid: FIREBASE_AUTH.currentUser.uid
    //         });
    //     });

    // }

    // function handleAuthStateChanged(user) {
    //     if(user){
    //         // signInButton.setAttribute("hidden","true");
    //         // signOutButton.removeAttribute("hidden");
    //         sendNotifiForm.removeAttribute("hidden");
    //         // checkSubcribe();

    //     }else{
    //         // signOutButton.setAttribute("hidden","true");
    //         // signInButton.removeAttribute("hidden");
    //         sendNotifiForm.setAttribute("hidden","true");
    //     }
        
    // }

    // function unsubscribeNotifi() {
    //     FIREBASE_MESSAGING.getToken()
    //     .then((token) => FIREBASE_MESSAGING.deleteToken(token))
    //     .then(() => FIREBASE_DATABASE.ref('/tokens').orderByChild('uid').equalTo(FIREBASE_AUTH.currentUser.uid).once('value'))
    //     .then((snapshot) => {
    //       const key = Object.keys(snapshot.val())[0];
    //       return FIREBASE_DATABASE.ref('/tokens').child(key).remove();
    //     })
    //     // .then(() => checkSubcribe())
    //     .catch((err) => {
    //       console.log("error deleting token :(");
    //     });       
    // }

    // function checkSubcribe() {
    //     FIREBASE_DATABASE.ref('/tokens').orderByChild('uid').equalTo(FIREBASE_AUTH.currentUser.uid).once('value').then((snapshot) => {
    //       if ( snapshot.val() ) {
    //         $(document).ready(function(){
    //             $('#tallModal').modal('hidden');
    //   });
    //       } else {
    //         // unsubscribeButton.setAttribute("hidden", "true");
    //         // subscribeButton.removeAttribute("hidden");
    //       }
    //     });
    //   }

//    function uploadfile(){
//     const storageRef = FIREBASE_STORAGE.ref();
//     const filename = document.getElementById('icon').files[0].name;
   
//     const uploadTask = storageRef.child(filename).put(document.getElementById('icon').files[0]);

//     uploadTask.on('state_changed', function(snapshot){
//         // Observe state change events such as progress, pause, and resume
//         // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//         var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         console.log('Upload is ' + progress + '% done');
//         switch (snapshot.state) {
//           case firebase.storage.TaskState.PAUSED: // or 'paused'
//             console.log('Upload is paused');
//             break;
//           case firebase.storage.TaskState.RUNNING: // or 'running'
//             console.log('Upload is running');
//             break;
//         }
//       }, function(error) {
//         // Handle unsuccessful uploads
//       }, function() {
//         // Handle successful uploads on complete
//         // For instance, get the download URL: https://firebasestorage.googleapis.com/...
//         uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
//           console.log('File available at', downloadURL);
//         });
//       });
//    }
  

    function sendNotification(e) {
        e.preventDefault();

        
        // uploadfile();

        const titleMessage = document.getElementById('form-field-1').value;
        console.log(titleMessage);
    
        const notificationMessage = document.getElementById('form-field-11').value;
        console.log(notificationMessage);

        const datetime = document.getElementById('date-timepicker1').value;
        console.log(datetime);

        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const time = today.getHours() + ":" + today.getMinutes();

        const datetoday = date +" "+time;

        const img = document.getElementById('id-input-file-2').files[0].name;
        console.log(img);

        FIREBASE_DATABASE.ref('/notifications').push({
            title: titleMessage,
            message: notificationMessage,
            datepust: datetime,
            datecreate: datetoday,
            icon: img
        }).then(() =>{
            document.getElementById('title').value = "";
            document.getElementById('notification-message').value = "";
            document.getElementById('datetime').value = "";
            document.getElementById('icon').value = "";
        });
    }

}