import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { db, admin } from './utils/firebase.js';

dotenv.config();

const seedUser = async () => {
    try {
        if (!db) {
            console.error("Firebase not initialized");
            process.exit(1);
        }
        console.log("Connected to Firestore...");

        const email = "admin@agriopti.com";
        const usersRef = db.collection("users");

        const existing = await usersRef.where("email", "==", email).get();

        if (!existing.empty) {
            console.log("User already exists!");
            process.exit();
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync("admin123", salt);

        const newUserData = {
            name: "AgriOpti Admin",
            email: email,
            password: hash,
            role: "farmer",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        await usersRef.add(newUserData);
        console.log("-----------------------------------------");
        console.log("SUCCESS: Default user created in Firestore!");
        console.log("Email: admin@agriopti.com");
        console.log("Password: admin123");
        console.log("-----------------------------------------");
        process.exit();
    } catch (error) {
        console.error("Error creating user:", error);
        process.exit(1);
    }
};

seedUser();
