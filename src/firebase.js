import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDW6NU9Fj6twiuCmoHJkV_BKB4U7QjyWag",
  authDomain: "library-management-77ff9.firebaseapp.com",
  projectId: "library-management-77ff9",
  storageBucket: "library-management-77ff9.firebasestorage.app",
  messagingSenderId: "448592666599",
  appId: "1:448592666599:web:8db5b72471241d4c4aa742"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);