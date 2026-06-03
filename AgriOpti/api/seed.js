import dotenv from 'dotenv';
import { db, admin } from './utils/firebase.js';

dotenv.config();

const machinery = [
    {
        name: "John Deere 5E Series",
        image: "https://images.unsplash.com/photo-1594494818244-b049d5204489?auto=format&fit=crop&q=80&w=800",
        desc: "Versatile utility tractor with 50-75 HP. Perfect for heavy-duty field work and transportation.",
        price: 1250000,
        stock: 5,
        rating: 4.8,
        producttype: "tools"
    },
    {
        name: "Precision Seeder X200",
        image: "https://images.unsplash.com/photo-1622383529957-cf13670f9227?auto=format&fit=crop&q=80&w=800",
        desc: "Advanced pneumatic seeder for precise depth control and optimized seed spacing.",
        price: 450000,
        stock: 12,
        rating: 4.5,
        producttype: "tools"
    },
    {
        name: "Crop Sprayer Drone V2",
        image: "https://images.unsplash.com/photo-1473960104312-d2e118318a4a?auto=format&fit=crop&q=80&w=800",
        desc: "Autonomous UAV for targeted pesticide application. Reduces chemical waste by 30%.",
        price: 85000,
        stock: 8,
        rating: 4.9,
        producttype: "pesticides"
    }
];

const crops = [
    {
        name: "Premium Basmati Rice",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800",
        desc: "High-quality, long-grain fragrant rice. Harvested using sustainable practices.",
        price: 120,
        stock: 1000,
        rating: 4.7,
        producttype: "crops"
    },
    {
        name: "Organic Wheat Seeds",
        image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800",
        desc: "High-yield, disease-resistant organic wheat varieties for the winter season.",
        price: 85,
        stock: 500,
        rating: 4.6,
        producttype: "crops"
    }
];

const seedDatabase = async () => {
    try {
        if (!db) {
            console.error("Firebase not initialized");
            process.exit(1);
        }
        console.log("Connecting to Firestore for seeding...");

        console.log("Inserting new machinery and crops...");
        const productsRef = db.collection("products");

        const allItems = [...machinery, ...crops];

        // Firestore batch insert
        const batch = db.batch();
        allItems.forEach(item => {
            const docRef = productsRef.doc();
            batch.set(docRef, {
                ...item,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
        });

        await batch.commit();

        console.log("Database seeded successfully! 🌱");
        process.exit();
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
