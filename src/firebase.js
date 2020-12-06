import firebase from "firebase";
// Required for side-effects
require("firebase/functions");

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXOqcLadhK_VfFAJxnDn5mue4gQD_Sl20",
  authDomain: "godsno-c543b.firebaseapp.com",
  databaseURL: "https://godsno-c543b.firebaseio.com",
  projectId: "godsno-c543b",
  storageBucket: "godsno-c543b.appspot.com",
  messagingSenderId: "460263212681",
  appId: "1:460263212681:web:bfb19508e2d11000ab2858",
  measurementId: "G-WQ2QZSH0NG",
};

// For allowing to call functions (prevent CORS error)
const FIREBASE_REGION = "europe-west1";

// Firestore
const firebaseApp = firebase.initializeApp(firebaseConfig);
export const db = firebaseApp.firestore();

// Firebase Functions
// Initialize Cloud Functions through Firebase
export var firebaseFunctions = firebase.app().functions(FIREBASE_REGION);

// Login/Authentication
// const googleProvider = new firebase.auth.GoogleAuthProvider();

// export const signInWithGoogle = () => {
//   firebase.auth().signInWithPopup(googleProvider);
// };
