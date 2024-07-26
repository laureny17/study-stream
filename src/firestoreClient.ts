import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import firebaseConfig from "./firebaseConfig"; // Adjust the path if necessary

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db: Firestore = getFirestore(app);

export { db };
