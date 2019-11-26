
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

      const dataList = firebase.database().ref('/notifications').orderByKey();
      dataList.once('value',snap=>{
          if (snap.val()) {
              const data = snap.val();
              var tableRef = document.getElementById('simple-table').getElementsByTagName('tbody')[0];
              for (let key in data) 
              {
                  // Insert a row in the table at the last row
                  var newRow   = tableRef.insertRow();
                  
                  // Insert a cell in the row at index 0
                  var newCellTitle  = newRow.insertCell(0);
                  var newCellMessage  = newRow.insertCell(1);
                  var newCellDatepust  = newRow.insertCell(2);
                  var newCellDateCreate  = newRow.insertCell(3);
                  var newCellImage = newRow.insertCell(4);
                  var newCellOptions = newRow.insertCell(5);
  
                  newCellTitle.innerHTML = data[key].title;
                  newCellMessage.innerHTML = data[key].message;
                  newCellDatepust.innerHTML = data[key].datepust;
                  newCellDateCreate.innerHTML = data[key].datecreate;
                  newCellImage.innerHTML = "<img style=\"max-width: 50px;\" src=\""+data[key].icon+"\">"
                  newCellOptions.innerHTML = "<button class=\"btn btn-saccess btn-sm\" data-toggle=\"modal\" data-target=\"#myModal\" onclick = 'updateCD(\""+key+"\",this)'>Sửa</button><button class=\"btn btn-danger btn-sm\" onclick='DeleteObject(\""+key+"\",this)'>Xóa</button>";
              }
          }
      });
  
      
      function insertCD(){
          // uploadfile();
          const save = document.getElementById('save');
  
          save.addEventListener('click',insert);
          function insert(){
              const titleMessage = document.getElementById('title').value;
          console.log(titleMessage);
      
          const notificationMessage = document.getElementById('message').value;
          console.log(notificationMessage);
  
          const datetime = document.getElementById('date-timepicker1').value;
          console.log(datetime);
  
          const today = new Date();
          const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
          const time = today.getHours() + ":" + today.getMinutes();
  
          const datetoday = date +" "+time;
  
          const img = document.getElementById('icon').files[0].name;
          console.log(img);
  
          firebase.database().ref('/notifications').push({
              title: titleMessage,
              message: notificationMessage,
              datepust: datetime,
              datecreate: datetoday,
              icon: "/img/" + img
          }).then(() =>{
             location.reload();
          })
          }
          
      }
  
  
      function updateCD(Id, obj){
          console.log('test update - '+Id);
          console.log("This - " + obj);
           var row = obj.parentNode.parentNode;
          dataList.once('value',snap=>{
          if (snap.val()) {
              const data = snap.val();
         document.getElementById('title').setAttribute( "placeholder",""+data[Id].title+"");
         document.getElementById('message').setAttribute( "placeholder",""+data[Id].message+"");
         document.getElementById('icon').setAttribute( "placeholder",""+data[Id].icon+"");
         document.getElementById('date-timepicker1').setAttribute( "placeholder",""+data[Id].datepust+"");
          }
      });
       const save = document.getElementById('save');
  
       save.addEventListener('click',updatepush);
       const today = new Date();
          const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
          const time = today.getHours() + ":" + today.getMinutes();
  
          const datetoday = date +" "+time;
  
      
      function updatepush(){
          var postData = {
              title: document.getElementById('title').value,
              message: document.getElementById('message').value,
              icon: "/img/" + document.getElementById('icon').files[0].name,
              datepust: document.getElementById('date-timepicker1').value,
              datecreate: datetoday
          };
          return firebase.database().ref('/notifications').child(Id).update(postData).then((
              location.reload()
          ));
          }
      }
  
      function DeleteObject(Id, obj){
          console.log("test delete -" + Id);
          console.log("This - " + obj);
          var row = obj.parentNode.parentNode;
          firebase.database().ref('/notifications').child(Id).remove()    
          .then((
              row.parentNode.removeChild(row)
          ));
      }
     
  }