import dotenv from 'dotenv';
import { db, admin } from './utils/firebase.js';

dotenv.config();

const seeds = [
    {
        "name": "Hybrid Tomato Seeds",
        "producttype": "crops",
        "desc": "High-yield hybrid tomato seeds suitable for all climates.",
        "price": 120,
        "stock": 80,
        "image": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea"
    },
    {
        "name": "Premium Wheat Seeds",
        "producttype": "crops",
        "desc": "Disease-resistant wheat seeds with high productivity.",
        "price": 90,
        "stock": 120,
        "image": "https://images.unsplash.com/photo-1500382017468-9049fed747ef"
    },
    {
        "name": "Golden Corn Seeds",
        "producttype": "crops",
        "desc": "Fast-growing corn seeds ideal for commercial farming.",
        "price": 110,
        "stock": 75,
        "image": "https://images.unsplash.com/photo-1601597111158-2fceff292cdc"
    },
    {
        "name": "Organic Rice Seeds",
        "producttype": "crops",
        "desc": "Premium organic rice seeds for high grain quality.",
        "price": 140,
        "stock": 95,
        "image": "https://images.unsplash.com/photo-1586201375761-83865001e31c"
    },
    {
        "name": "Spinach Seeds",
        "producttype": "crops",
        "desc": "Nutritious leafy vegetable seeds with quick harvest.",
        "price": 60,
        "stock": 150,
        "image": "https://images.unsplash.com/photo-1576045057995-568f588f82fb"
    },
    {
        "name": "Cucumber Seeds",
        "producttype": "crops",
        "desc": "Hybrid cucumber seeds for fresh market production.",
        "price": 85,
        "stock": 130,
        "image": "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce"
    },
    {
        "name": "Sunflower Seeds",
        "producttype": "crops",
        "desc": "Oil-rich sunflower seeds suitable for large farms.",
        "price": 95,
        "stock": 100,
        "image": "https://images.unsplash.com/photo-1508747703725-719777637510"
    },
    {
        "name": "Chili Seeds",
        "producttype": "crops",
        "desc": "Spicy red chili seeds with strong disease resistance.",
        "price": 75,
        "stock": 110,
        "image": "https://images.unsplash.com/photo-1587049352846-4a222e784d38"
    },
    {
        "name": "Carrot Seeds",
        "producttype": "crops",
        "desc": "High-quality carrot seeds with uniform root growth.",
        "price": 70,
        "stock": 140,
        "image": "https://images.unsplash.com/photo-1447175008436-054170c2e979"
    },
    {
        "name": "Pumpkin Seeds",
        "producttype": "crops",
        "desc": "Large fruit pumpkin seeds ideal for vegetable farming.",
        "price": 80,
        "stock": 90,
        "image": "https://images.unsplash.com/photo-1506807803488-8eafc15316c7"
    }
];

const pesticides = [
    {
        "name": "Neem Oil Pesticide",
        "producttype": "pesticides",
        "desc": "Organic neem-based pesticide effective against insects.",
        "price": 250,
        "stock": 60,
        "image": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449"
    },
    {
        "name": "Insect Guard Spray",
        "producttype": "pesticides",
        "desc": "Fast-acting spray to control crop insects.",
        "price": 300,
        "stock": 70,
        "image": "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea"
    },
    {
        "name": "Crop Defender Liquid",
        "producttype": "pesticides",
        "desc": "Protects crops from fungal and insect attacks.",
        "price": 340,
        "stock": 50,
        "image": "https://images.unsplash.com/photo-1589923188900-85dae523342b"
    },
    {
        "name": "Bio Pest Control",
        "producttype": "pesticides",
        "desc": "Biological pesticide safe for organic farming.",
        "price": 280,
        "stock": 65,
        "image": "https://images.unsplash.com/photo-1598515213692-d4a0a0d2f3c0"
    },
    {
        "name": "Fungus Shield",
        "producttype": "pesticides",
        "desc": "Specialized fungicide for leaf protection.",
        "price": 320,
        "stock": 40,
        "image": "https://images.unsplash.com/photo-1615818499660-30bb5816e1c7"
    },
    {
        "name": "Weed Terminator",
        "producttype": "pesticides",
        "desc": "Effective herbicide for weed management.",
        "price": 360,
        "stock": 55,
        "image": "https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
    },
    {
        "name": "Plant Protect Plus",
        "producttype": "pesticides",
        "desc": "Multi-purpose pesticide for vegetable crops.",
        "price": 295,
        "stock": 75,
        "image": "https://images.unsplash.com/photo-1625246333409-0c7f8c0f6c2d"
    },
    {
        "name": "Crop Guard Concentrate",
        "producttype": "pesticides",
        "desc": "Highly concentrated pest control formula.",
        "price": 380,
        "stock": 45,
        "image": "https://images.unsplash.com/photo-1625246333349-3c7c2c932a3b"
    },
    {
        "name": "Eco Pest Solution",
        "producttype": "pesticides",
        "desc": "Environmentally friendly pest protection.",
        "price": 260,
        "stock": 80,
        "image": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
    },
    {
        "name": "Leaf Armor Spray",
        "producttype": "pesticides",
        "desc": "Protects leaves from pests and diseases.",
        "price": 310,
        "stock": 52,
        "image": "https://images.unsplash.com/photo-1581578731548-c64695cc6952"
    }
];

const tools = [
    {
        "name": "Steel Hand Hoe",
        "producttype": "tools",
        "desc": "Durable steel hoe for soil cultivation.",
        "price": 450,
        "stock": 35,
        "image": "https://images.unsplash.com/photo-1615811361523-6bd03d7746f5"
    },
    {
        "name": "Farm Shovel",
        "producttype": "tools",
        "desc": "Heavy-duty shovel for digging and lifting soil.",
        "price": 520,
        "stock": 28,
        "image": "https://images.unsplash.com/photo-1582515073490-dc6d7c8c2e3d"
    },
    {
        "name": "Pruning Shears",
        "producttype": "tools",
        "desc": "Sharp pruning tool for cutting plant branches.",
        "price": 300,
        "stock": 45,
        "image": "https://images.unsplash.com/photo-1617575521317-d2974f3b56d2"
    },
    {
        "name": "Garden Rake",
        "producttype": "tools",
        "desc": "Strong rake for leveling soil and removing debris.",
        "price": 410,
        "stock": 30,
        "image": "https://images.unsplash.com/photo-1598514982451-bc3a6b4b5483"
    },
    {
        "name": "Hand Trowel",
        "producttype": "tools",
        "desc": "Compact trowel for planting seedlings.",
        "price": 220,
        "stock": 50,
        "image": "https://images.unsplash.com/photo-1615811361153-2eec2a3f8b80"
    },
    {
        "name": "Soil Cultivator",
        "producttype": "tools",
        "desc": "Tool designed for loosening compact soil.",
        "price": 390,
        "stock": 34,
        "image": "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2"
    },
    {
        "name": "Garden Fork",
        "producttype": "tools",
        "desc": "Useful tool for aerating soil.",
        "price": 480,
        "stock": 29,
        "image": "https://images.unsplash.com/photo-1599685315640-9ceab0f7f38c"
    },
    {
        "name": "Weeding Tool",
        "producttype": "tools",
        "desc": "Efficient tool to remove weeds easily.",
        "price": 260,
        "stock": 44,
        "image": "https://images.unsplash.com/photo-1581579188871-45ea61f2a6fa"
    },
    {
        "name": "Planting Dibber",
        "producttype": "tools",
        "desc": "Ideal for planting seeds and bulbs.",
        "price": 210,
        "stock": 60,
        "image": "https://images.unsplash.com/photo-1615811361180-9f1a61bf3eef"
    },
    {
        "name": "Garden Knife",
        "producttype": "tools",
        "desc": "Sharp blade tool for cutting stems.",
        "price": 320,
        "stock": 38,
        "image": "https://images.unsplash.com/photo-1598515214211-89d3b5d9a70d"
    }
];

const allProducts = [...seeds, ...pesticides, ...tools];

const seedCustomMarket = async () => {
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

        const productsRef = db.collection("products");

        // Delete all existing products
        const snapshot = await productsRef.get();
        if (!snapshot.empty) {
            console.log(`Deleting ${snapshot.size} existing products...`);
            const deleteBatch = db.batch();
            snapshot.docs.forEach((doc) => {
                deleteBatch.delete(doc.ref);
            });
            await deleteBatch.commit();
        }

        const insertBatch = db.batch();
        let count = 0;

        for (const productData of allProducts) {
            const product = {
                ...productData,
                user: userId,
                sale: Math.floor(Math.random() * 50),
                rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 rating
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };
            const newDocRef = productsRef.doc();
            insertBatch.set(newDocRef, product);
            count++;
        }

        await insertBatch.commit();

        console.log("-----------------------------------------");
        console.log(`SUCCESS: Successfully seeded ${count} custom products into Firestore!`);
        console.log("-----------------------------------------");
        process.exit();
    } catch (error) {
        console.error("Error seeding custom market:", error);
        process.exit(1);
    }
};

seedCustomMarket();
