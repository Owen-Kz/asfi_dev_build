// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9glPHSmg43DC_UfYcqolmjf1UCUSrBPM",
  authDomain: "asfi-35ae2.firebaseapp.com",
  projectId: "asfi-35ae2",
  storageBucket: "asfi-35ae2.appspot.com",
  messagingSenderId: "664834133528",
  appId: "1:664834133528:web:ef137ded0f9b67a32bbd6d",
  measurementId: "G-32YRZWEG3P"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAnalytics = getAnalytics(firebaseApp);

moduel.exports = {
    firebaseApp,
    firebaseAnalytics
} 