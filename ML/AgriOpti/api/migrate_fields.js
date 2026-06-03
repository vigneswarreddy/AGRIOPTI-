import { db } from './utils/firebase.js';

const migrateProductFields = async () => {
    try {
        if (!db) {
            console.error("Firebase not initialized");
            process.exit(1);
        }
        console.log("Connected to Firestore. Starting field migration...");

        const productsRef = db.collection("products");
        const snapshot = await productsRef.get();

        console.log(`Checking ${snapshot.size} products...`);
        let updatedCount = 0;
        let skippedCount = 0;

        for (const doc of snapshot.docs) {
            const data = doc.data();
            const updates = {};

            // 1. Handle producttype -> productType
            if (data.producttype && !data.productType) {
                updates.productType = data.producttype;
                // Optionally remove the old field, but keeping it for safety during transition
                // updates.producttype = admin.firestore.FieldValue.delete(); 
            }

            // 2. Handle type -> productType (if any used 'type' before)
            if (data.type && !data.productType) {
                updates.productType = data.type;
            }

            if (Object.keys(updates).length > 0) {
                await doc.ref.update(updates);
                console.log(`  Updated product: ${data.name} (${doc.id})`);
                updatedCount++;
            } else {
                skippedCount++;
            }
        }

        console.log("-----------------------------------------");
        console.log(`MIGRATION SUMMARY:`);
        console.log(`  Updated (Fields): ${updatedCount}`);
        console.log(`  Skipped:          ${skippedCount}`);
        console.log(`Total processed:    ${snapshot.size}`);
        console.log("-----------------------------------------");
        process.exit(0);
    } catch (error) {
        console.error("Migration fatal error:", error);
        process.exit(1);
    }
};

migrateProductFields();
