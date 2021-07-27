import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAenR9aWgjxPWTL4AIRzxU1H3Vv4aoQiaI",
    authDomain: "instaclone-707jk.firebaseapp.com",
    projectId: "instaclone-707jk",
    storageBucket: "instaclone-707jk.appspot.com",
    messagingSenderId: "1057301615026",
    appId: "1:1057301615026:web:6389314fc5a085e04114ab",
    measurementId: "G-MMP49LZ7C0"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};