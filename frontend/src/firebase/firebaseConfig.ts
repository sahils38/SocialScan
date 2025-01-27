// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBEKEyq5yIwSlbYH0MKqsFdScMKC5N2R2g",
    authDomain: "socialscan-5ae6b.firebaseapp.com",
    projectId: "socialscan-5ae6b",
    storageBucket: "socialscan-5ae6b.firebasestorage.app",
    messagingSenderId: "1007222591439",
    appId: "1:1007222591439:web:3fb34d7099c1ef60400cba",
    measurementId: "G-ZB6GCW4QXF"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore and Authentication
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
