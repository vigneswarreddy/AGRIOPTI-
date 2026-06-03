import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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
const db = getFirestore(app);

async function checkProducts() {
    console.log("Checking products collection...");
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        if (querySnapshot.empty) {
            console.log("NO PRODUCTS FOUND. The collection is entirely empty.");
        } else {
            console.log(`FOUND ${querySnapshot.size} PRODUCTS! Here they are:`);
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                console.log(`- ${data.name} (Type: ${data.productType})`);
            });
        }
    } catch (error) {
        console.error("Firebase Error:", error.message);
    }
    process.exit(0);
}

checkProducts();
