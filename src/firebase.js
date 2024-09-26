// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4wPmkn49ZlozITHGSlmcnYOahUi4wIac",
  authDomain: "eigarcom-2024.firebaseapp.com",
  projectId: "eigarcom-2024",
  storageBucket: "eigarcom-2024.appspot.com",
  messagingSenderId: "737982346611",
  appId: "1:737982346611:web:bba90a91ae56bf20d34106",
  measurementId: "G-2GT662BS4W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);