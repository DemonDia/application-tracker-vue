// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDb0taCgxnu7QHj1o89odZRVLl9x-p6Y5c",
  authDomain: "application-tracker-vue.firebaseapp.com",
  projectId: "application-tracker-vue",
  storageBucket: "application-tracker-vue.appspot.com",
  messagingSenderId: "194872733556",
  appId: "1:194872733556:web:fdac3ee09017c5d92c4621",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
