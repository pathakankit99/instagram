// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase'
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCOVPGyVhPVKR6b8eyPKg-LdHBsWlDbYBM",
    authDomain: "ak99instagram.firebaseapp.com",
    databaseURL: "https://ak99instagram.firebaseio.com",
    projectId: "ak99instagram",
    storageBucket: "ak99instagram.appspot.com",
    messagingSenderId: "188615511118",
    appId: "1:188615511118:web:92dd3ef79afd98552e471f",
    measurementId: "G-KYT758SNLK"
  });
  

  const db = firebaseApp.firestore()
  const auth = firebase.auth()
  const storage = firebase.storage()

  export  {db, auth, storage}
