import { admin, db } from './utils/firebase.js';

async function testFirebase() {
    try {
        if (!db) {
            console.error("Firebase Admin SDK failed to initialize. 'db' is null.");
            process.exit(1);
        }

        console.log("Firebase Admin SDK seems initialized.");
        console.log("Attempting to list users to verify authentication works...");
        const listUsersResult = await admin.auth().listUsers(1);
        console.log("Successfully fetched users. Total users found (max 1):", listUsersResult.users.length);
        console.log("Firebase connection is WORKING PROPERLY.");
        process.exit(0);
    } catch (error) {
        console.error("Firebase connection test failed with error:", error.message);
        process.exit(1);
    }
}

testFirebase();
