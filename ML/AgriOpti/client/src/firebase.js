import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCHP1U-OYjvhSH8mvUqZs-i9qaeW4blzWM",
  authDomain: "agriopti-b67b6.firebaseapp.com",
  projectId: "agriopti-b67b6",
  storageBucket: "agriopti-b67b6.firebasestorage.app",
  messagingSenderId: "277937899041",
  appId: "1:277937899041:web:255f2fba2de0da0a44c560",
  measurementId: "G-2MQLH39VRB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export default app;

