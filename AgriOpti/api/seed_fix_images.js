import dotenv from 'dotenv';
import { db } from './utils/firebase.js';

dotenv.config();

// Using reliable static image URLs from picsum.photos and other CDNs
const imageUpdates = {
    // Pesticides - using reliable agriculture/nature images
    "Plant Protect Plus": "https://cdn.pixabay.com/photo/2016/09/21/04/46/barley-field-1684052_640.jpg",
    "Crop Guard Concentrate": "https://cdn.pixabay.com/photo/2017/09/01/13/56/university-of-agriculture-2704999_640.jpg",
    "Bio Pest Control": "https://cdn.pixabay.com/photo/2020/06/20/01/07/sprayer-5319812_640.jpg",

    // Tools - using reliable tool/garden images
    "Steel Hand Hoe": "https://cdn.pixabay.com/photo/2017/08/02/01/31/garden-2569745_640.jpg",
    "Garden Knife": "https://cdn.pixabay.com/photo/2014/12/11/02/55/cereals-563796_640.jpg",
    "Hand Trowel": "https://cdn.pixabay.com/photo/2016/08/11/08/43/potted-plant-1585418_640.jpg",
    "Garden Fork": "https://cdn.pixabay.com/photo/2015/05/07/11/26/garden-756711_640.jpg",
    "Weeding Tool": "https://cdn.pixabay.com/photo/2016/07/28/06/28/agriculture-1547006_640.jpg",
    "Planting Dibber": "https://cdn.pixabay.com/photo/2020/04/19/08/17/watermelon-5062905_640.jpg",
    "Garden Rake": "https://cdn.pixabay.com/photo/2014/06/11/17/00/autumn-366464_640.jpg",
    "Farm Shovel": "https://cdn.pixabay.com/photo/2017/07/24/02/40/garden-2533266_640.jpg",
};

const fixImages = async () => {
    try {
        if (!db) {
            console.error("Firebase not initialized");
            process.exit(1);
        }
        console.log("Connected to Firestore...");

        const productsRef = db.collection("products");
        const snapshot = await productsRef.get();

        let updatedCount = 0;
        const batch = db.batch();

        snapshot.docs.forEach((doc) => {
            const data = doc.data();
            if (imageUpdates[data.name]) {
                batch.update(doc.ref, { image: imageUpdates[data.name] });
                updatedCount++;
                console.log(`  Queued fix: ${data.name} -> ${imageUpdates[data.name]}`);
            }
        });

        if (updatedCount > 0) {
            await batch.commit();
        }

        console.log("-----------------------------------------");
        console.log(`SUCCESS: Fixed ${updatedCount} product images!`);
        console.log("-----------------------------------------");
        process.exit();
    } catch (error) {
        console.error("Error fixing images:", error);
        process.exit(1);
    }
};

fixImages();
