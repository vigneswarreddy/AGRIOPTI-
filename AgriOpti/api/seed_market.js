import dotenv from 'dotenv';
import { db, admin } from './utils/firebase.js';

dotenv.config();

const categories = [
    { type: "crops", keyword: "seeds" },
    { type: "pesticides", keyword: "pesticide" },
    { type: "tools", keyword: "farm,tools" },
    { type: "fertilizers", keyword: "fertilizer" },
    { type: "machinery", keyword: "tractor" },
    { type: "irrigation", keyword: "irrigation" },
    { type: "greenhouses", keyword: "greenhouse" },
    { type: "harvesting", keyword: "harvest" },
    { type: "transport", keyword: "truck,farm" }
];

const generateProducts = (userId) => {
    const products = [];

    categories.forEach(category => {
        for (let i = 1; i <= 10; i++) {
            products.push({
                name: `${category.type.charAt(0).toUpperCase() + category.type.slice(1)} Item ${i}`,
                image: `https://loremflickr.com/400/400/${category.keyword}?lock=${i + category.type.length}`,
                desc: `High quality ${category.type} suitable for all your agricultural needs. Designed for optimal performance and yield.`,
                price: Math.floor(Math.random() * 5000) + 50,
                stock: Math.floor(Math.random() * 200) + 10,
                producttype: category.type,
                user: userId,
                sale: 0,
                rating: Math.floor(Math.random() * 5) + 1,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
        }
    });

    return products;
};

const seedMarket = async () => {
    try {
        if (!db) {
            console.error("Firebase not initialized");
            process.exit(1);
        }
        console.log("Connected to Firestore...");

        const email = "admin@agriopti.com";
        const usersRef = db.collection("users");

        const existing = await usersRef.where("email", "==", email).get();

        let userId = "";
        if (!existing.empty) {
            userId = existing.docs[0].id;
            console.log(`Found admin user: ${userId}`);
        } else {
            console.log("Admin user not found. Please run seed_user.js first.");
            process.exit(1);
        }

        const products = generateProducts(userId);

        const productsRef = db.collection("products");

        let count = 0;
        // Firebase batch supports up to 500 operations. We have 90.
        const batch = db.batch();

        for (const product of products) {
            const newDocRef = productsRef.doc();
            batch.set(newDocRef, product);
            count++;
        }

        await batch.commit();

        console.log("-----------------------------------------");
        console.log(`SUCCESS: Successfully seeded ${count} products into Firestore!`);
        console.log("Categories Added:");
        categories.forEach(c => console.log(`- ${c.type} (10 items)`));
        console.log("-----------------------------------------");
        process.exit();
    } catch (error) {
        console.error("Error seeding market:", error);
        process.exit(1);
    }
};

seedMarket();
