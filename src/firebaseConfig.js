import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBKbXc3FQv9DcUrtdy8ess3XRwCaZpXphc",
  authDomain: "movie-database-f58ae.firebaseapp.com",
  projectId: "movie-database-f58ae",
  storageBucket: "movie-database-f58ae.appspot.com",
  messagingSenderId: "345372233156",
  appId: "1:345372233156:web:0fd40a58c90f75a7dda891",
  measurementId: "G-6131G5VWTB",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(firebaseApp);

//initialize firebase auth
// const auth = getAuth();

export default { firebaseApp, db };
