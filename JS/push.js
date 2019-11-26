
{
    const FIREBASE_AUTH = firebase.auth();    
    const FIREBASE_MESSAGING = firebase.messaging();
    const FIREBASE_DATABASE = firebase.database();
  
    const subscribeButton = document.getElementById('subcribe');
    const unsubscribeButton = document.getElementById('unsubcribe');
    const sendNotifiForm = document.getElementById('send-notification-form');
  
    subscribeButton.addEventListener('click',subandlogin);
    unsubscribeButton.addEventListener('click',unsubscribeNotifi);
    sendNotifiForm.addEventListener('submit',sendNotification);

    FIREBASE_AUTH.onAuthStateChanged(handleAuthStateChanged);
    FIREBASE_MESSAGING.onTokenRefresh(handleTokenRefresh);
 

    FIREBASE_MESSAGING.usePublicVapidKey("BG9TQX87n40XCXw9FtEnbtxgVsGw4Z_npuejD1B2zLm1E8rFlICCtu2qK2xyYmL9LoLw8W5ICGwu2XWFlp_w2z4");
    function subandlogin(){
       console.log('ok');
        signIn();
        subscribeToNotifi();
    }
    function subscribeToNotifi() {
        FIREBASE_MESSAGING.requestPermission()
        .then(() => handleTokenRefresh())
        .then(() => checkSubcribe())
        .then(()=>{
            location.replace('listdevice.html')
        })
        .catch((err) => {
         console.log("error getting permission :(");
        });

     }


    function signIn() {
        FIREBASE_AUTH.signInAnonymously().catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
          });
    }

    function handleTokenRefresh() {
        return FIREBASE_MESSAGING.getToken()
        .then((token) => {
            FIREBASE_DATABASE.ref('/tokens').push({
                token: token,
                uid: FIREBASE_AUTH.currentUser.uid
            });
        });
    }

    function handleAuthStateChanged(user) {
        if(user){
            checkSubcribe();
        }
    }

    function checkSubcribe() {
        FIREBASE_DATABASE.ref('/tokens').orderByChild('uid').equalTo(FIREBASE_AUTH.currentUser.uid).once('value').then((snapshot) => {
          if ( snapshot.val() ) {
              console.log(snapshot.val());
                subscribeButton.setAttribute("hidden","true");
                unsubscribeButton.removeAttribute("hidden");
          } else {
            unsubscribeButton.setAttribute("hidden", "true");
            subscribeButton.removeAttribute("hidden");
          }
        });
      }

    function unsubscribeNotifi() {
        FIREBASE_MESSAGING.getToken()
        .then((token) => FIREBASE_MESSAGING.deleteToken(token))
        .then(() => FIREBASE_DATABASE.ref('/tokens').orderByChild('uid').equalTo(FIREBASE_AUTH.currentUser.uid).once('value'))
        .then((snapshot) => {
          const key = Object.keys(snapshot.val())[0];
          return FIREBASE_DATABASE.ref('/tokens').child(key).remove();
        })
        .then(() => checkSubcribe())
        .catch((err) => {
          console.log("error deleting token :(");
        });       
    }

    function uploadfiles(){
        
        var storageRef = firebase.storage().ref('/img/'+document.getElementById('id-input-file-2').files[0].name);

        var uploadTask = storageRef.put(document.getElementById('id-input-file-2').files[0]);

        uploadTask.on('state_changed', function(snapshot){
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          }, function(error) {
            // Handle unsuccessful uploads
          }, function() {
          
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
               console.log(downloadURL);
            });
          });

    }
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#blah')
                    .attr('src', e.target.result);
            };

            reader.readAsDataURL(input.files[0]);
        }
    }


    function sendNotification(e) {
        e.preventDefault();
        
        // uploadfile();

        const titleMessage = document.getElementById('form-field-1').value;
        
        const notificationMessage = document.getElementById('form-field-11').value;

        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const time = today.getHours() + ":" + today.getMinutes();

        const datetoday = date +" "+time;

        const img = document.getElementById('id-input-file-2').files[0].name;
        
        uploadfiles();

        FIREBASE_DATABASE.ref('/notifications').push({
            title: titleMessage,
            message: notificationMessage,
            datepust: datetoday,
            datecreate: datetoday,
            icon: "/img/" +img
            
        }).then(() =>{
            document.getElementById('form-field-1').value = "";
            document.getElementById('form-field-11').value = "";
            document.getElementById('id-input-file-2').value = "";
            alert("push thành công");
        })
    }

}