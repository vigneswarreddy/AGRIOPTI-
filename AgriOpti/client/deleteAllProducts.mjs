import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc } from "firebase/firestore";

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

async function deleteAllProducts() {
  console.log("Fetching all products from Firestore...");
  try {
    const querySnapshot = await getDocs(collection(db, "products"));

    if (querySnapshot.empty) {
      console.log("No products found. Collection is already empty.");
      process.exit(0);
    }

    console.log(`Found ${querySnapshot.size} products. Deleting all...`);

    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    console.log(`✅ Successfully deleted all ${querySnapshot.size} products.`);
  } catch (error) {
    console.error("❌ Error deleting products:", error.message);
  }
  process.exit(0);
}

deleteAllProducts();
