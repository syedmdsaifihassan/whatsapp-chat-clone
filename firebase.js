// import firebase from 'firebase';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCdSy5txoRneX0vR1lqRVOxSdIKDuSbBwc",
    authDomain: "whatsapp-a71d1.firebaseapp.com",
    projectId: "whatsapp-a71d1",
    storageBucket: "whatsapp-a71d1.appspot.com",
    messagingSenderId: "23247446183",
    appId: "1:23247446183:web:dd6f948b24412b8368fb82"
  };

const app = !firebase.apps.length
    ? firebase.initializeApp(firebaseConfig) 
    : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };