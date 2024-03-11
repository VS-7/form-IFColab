// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbkMRcRvYBVWree4ObDCoo4pOQmI0xlag",
  authDomain: "formulario-47d9b.firebaseapp.com",
  projectId: "formulario-47d9b",
  storageBucket: "formulario-47d9b.appspot.com",
  messagingSenderId: "74431513657",
  appId: "1:74431513657:web:443949e76ad1eac3a739e8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
