// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeUYx_W7KNQteTtp5CdibAx7fWobTsvyk",
  authDomain: "habittracker-fd5e8.firebaseapp.com",
  projectId: "habittracker-fd5e8",
  storageBucket: "habittracker-fd5e8.firebasestorage.app",
  messagingSenderId: "267021386132",
  appId: "1:267021386132:web:75eec0aeb59cbca4a80f81",
  measurementId: "G-6K55R2YMW5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);