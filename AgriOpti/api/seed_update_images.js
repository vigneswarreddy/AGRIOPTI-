import dotenv from 'dotenv';
import { db } from './utils/firebase.js';

dotenv.config();

// Map of product names to their new image URLs
const imageUpdates = {
    "Plant Protect Plus": "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=400",
    "Crop Guard Concentrate": "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=400",
    "Bio Pest Control": "https://images.unsplash.com/photo-1598515213692-d4a0a0d2f3c0?w=400",
    "Steel Hand Hoe": "https://images.unsplash.com/photo-1615811361523-6bd03d7746f5?w=400",
    "Garden Knife": "https://images.unsplash.com/photo-1598515214211-89d3b5d9a70d?w=400",
    "Hand Trowel": "https://images.unsplash.com/photo-1615811361153-2eec2a3f8b80?w=400",
    "Garden Fork": "https://images.unsplash.com/photo-1599685315640-9ceab0f7f38c?w=400",
    "Weeding Tool": "https://images.unsplash.com/photo-1581579188871-45ea61f2a6fa?w=400",
    "Planting Dibber": "https://images.unsplash.com/photo-1615811361180-9f1a61bf3eef?w=400",
    "Garden Rake": "https://images.unsplash.com/photo-1598514982451-bc3a6b4b5483?w=400",
    "Farm Shovel": "https://images.unsplash.com/photo-1582515073490-dc6d7c8c2e3d?w=400",
    // Also add ?w=400 to all other images for consistent sizing
    "Hybrid Tomato Seeds": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400",
    "Premium Wheat Seeds": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400",
    "Golden Corn Seeds": "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=400",
    "Organic Rice Seeds": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
    "Spinach Seeds": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400",
    "Cucumber Seeds": "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400",
    "Sunflower Seeds": "https://images.unsplash.com/photo-1508747703725-719777637510?w=400",
    "Chili Seeds": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400",
    "Carrot Seeds": "https://images.unsplash.com/photo-1447175008436-054170c2e979?w=400",
    "Pumpkin Seeds": "https://images.unsplash.com/photo-1506807803488-8eafc15316c7?w=400",
    "Neem Oil Pesticide": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
    "Insect Guard Spray": "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=400",
    "Crop Defender Liquid": "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=400",
    "Fungus Shield": "https://images.unsplash.com/photo-1615818499660-30bb5816e1c7?w=400",
    "Weed Terminator": "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400",
    "Eco Pest Solution": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400",
    "Leaf Armor Spray": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
    "Pruning Shears": "https://images.unsplash.com/photo-1617575521317-d2974f3b56d2?w=400",
    "Soil Cultivator": "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400",
};

const updateImages = async () => {
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
                console.log(`  Queued update: ${data.name}`);
            }
        });

        if (updatedCount > 0) {
            await batch.commit();
        }

        console.log("-----------------------------------------");
        console.log(`SUCCESS: Updated ${updatedCount} product images!`);
        console.log("-----------------------------------------");
        process.exit();
    } catch (error) {
        console.error("Error updating images:", error);
        process.exit(1);
    }
};

updateImages();
