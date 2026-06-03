import { admin } from './utils/firebase.js';

const setStorageCors = async () => {
    try {
        const bucket = admin.storage().bucket();
        await bucket.setCorsConfiguration([
            {
                origin: ['http://localhost:5173'],
                method: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
                responseHeader: ['Content-Type', 'x-goog-resumable'],
                maxAgeSeconds: 3600
            }
        ]);
        console.log('Successfully updated CORS configuration for bucket:', bucket.name);
        process.exit(0);
    } catch (error) {
        console.error('Error setting CORS:', error);
        process.exit(1);
    }
};

setStorageCors();
