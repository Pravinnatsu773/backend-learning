

const admin = require('firebase-admin');
const serviceAccount = require('./get-kudos-85768-firebase-adminsdk-7bjv9-3f2a23c9c3.json')


const firebaseConfig = {
    apiKey: "AIzaSyAn5vnD0IA2KICRbX1xbvTa4XCeTNbqY38",
    authDomain: "get-kudos-85768.firebaseapp.com",
    projectId: "get-kudos-85768",
    storageBucket: "get-kudos-85768.appspot.com",
    messagingSenderId: "828101932605",
    appId: "1:828101932605:web:4790520cbcac3c3d6c5c54",
    measurementId: "G-G2H73C6ZLT"
  };

// Initialize Firebase Admin SDK
const firebaseApp  = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://get-kudos-85768.appspot.com"    
  });


module.exports = {firebaseApp}
