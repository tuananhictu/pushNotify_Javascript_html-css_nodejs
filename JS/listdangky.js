
{
    const firebaseConfig = {
      apiKey: "AIzaSyASigiAdb9DubOu0uis5_EweXwO9o3soM0",
      authDomain: "pushnotif-a040e.firebaseapp.com",
      databaseURL: "https://pushnotif-a040e.firebaseio.com",
      projectId: "pushnotif-a040e",
      storageBucket: "pushnotif-a040e.appspot.com",
      messagingSenderId: "766195548458",
      appId: "1:766195548458:web:c8b941462fcb0169b49e53",
      measurementId: "G-HEQWG5LW0D"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
    const FIREBASE_AUTH = firebase.auth();    
    const FIREBASE_MESSAGING = firebase.messaging();
    const FIREBASE_DATABASE = firebase.database();
  
    const subscribeButton = document.getElementById('subcribe');
    const unsubscribeButton = document.getElementById('unsubcribe');
  
    subscribeButton.addEventListener('click',subandlogin);
    unsubscribeButton.addEventListener('click',unsubscribeNotifi);

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
        .then(()=> {
          location.reload();
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
        .then(()=>{
          location.replace('index.html');
        })
        .then(() => checkSubcribe())
        .catch((err) => {
          console.log("error deleting token :(");
        });       
    }




      const showlistdata = firebase.database().ref('/tokens').orderByKey();
      showlistdata.once('value',snap => {
          if (snap.val()) {
              const data = snap.val();
              var tableRef = document.getElementById('tbList').getElementsByTagName('tbody')[0];
              
              for (let key in data) 
              {
                       // Insert a row in the table at the last row
                  var newRow   = tableRef.insertRow();
                  
                  // Insert a cell in the row at index 0
                  var newCellUid  = newRow.insertCell(0);
                  var newCellCountClick  = newRow.insertCell(1);
                  var newCellClickEnd  = newRow.insertCell(2);
                  var newCellOptions = newRow.insertCell(3);
  
                  newCellUid.innerHTML = data[key].uid;
                  newCellCountClick.innerHTML = "null";
                  newCellClickEnd.innerHTML = "null";
                  newCellOptions.innerHTML = "<button class=\" btn btn-danger btn-sm\" onclick='DeleteObject(\""+key+"\",this)'>Xóa</button>";
                 
              }
                      
          }
          
      });
      function DeleteObject(Id, obj){
          console.log("test delete -" + Id);
          console.log("This - " + obj);
          var row = obj.parentNode.parentNode;
          firebase.database().ref('/tokens').child(Id).remove()
          .then((
              row.parentNode.removeChild(row)
          ));
      }
  
    
  }