import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './logger.js';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serviceAccount;

try {
    // Option 1: Try reading from a local file (e.g., serviceAccountKey.json in the project root)
    const serviceAccountPath = path.resolve(__dirname, '..', 'serviceAccountKey.json');
    if (fs.existsSync(serviceAccountPath)) {
        serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        logger.info("Loaded Firebase service account key from file.");
    }
    // Option 2: Try parsing from process.env.FIREBASE_SERVICE_ACCOUNT (JSON string)
    else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        logger.info("Loaded Firebase service account key from environment variable.");
    }
    else {
        logger.warn("No Firebase service account key found. Please provide 'serviceAccountKey.json' in the root or set process.env.FIREBASE_SERVICE_ACCOUNT.");
    }

    if (serviceAccount && !admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: "agriopti-kcham.firebasestorage.app"
        });
        logger.info("Firebase Admin SDK initialized successfully with storageBucket.");
    }
} catch (error) {
    logger.error("Error initializing Firebase Admin SDK:", error);
}

const db = admin.apps.length ? admin.firestore() : null;

export { admin, db };
