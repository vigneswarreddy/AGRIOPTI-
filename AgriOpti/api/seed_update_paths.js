import dotenv from 'dotenv';
import { db } from './utils/firebase.js';

dotenv.config();

function slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const updatePaths = async () => {
    try {
        if (!db) {
            console.error("Firebase not initialized");
            process.exit(1);
        }
        console.log("Connected to Firestore...");

        const productsRef = db.collection("products");
        const snapshot = await productsRef.get();
        const batch = db.batch();
        let updatedCount = 0;

        snapshot.docs.forEach((doc) => {
            const data = doc.data();
            const localPath = `/products/${slugify(data.name)}.jpg`;

            if (data.image !== localPath) {
                batch.update(doc.ref, { image: localPath });
                updatedCount++;
                console.log(`  ${data.name} -> ${localPath}`);
            }
        });

        if (updatedCount > 0) {
            await batch.commit();
        }

        console.log("-----------------------------------------");
        console.log(`Updated ${updatedCount} product paths in Firebase`);
        console.log("-----------------------------------------");
        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

updatePaths();
