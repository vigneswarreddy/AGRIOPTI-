import dotenv from 'dotenv';
import { db, admin } from './utils/firebase.js';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';

dotenv.config();

const PUBLIC_DIR = path.resolve('client/public');

function slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function fetchImage(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        
        const doRequest = (requestUrl, redirectCount = 0) => {
            if (redirectCount > 5) {
                reject(new Error('Too many redirects'));
                return;
            }

            const proto = requestUrl.startsWith('https') ? https : http;
            proto.get(requestUrl, (response) => {
                if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                    let redirectUrl = response.headers.location;
                    if (redirectUrl.startsWith('/')) {
                        const urlObj = new URL(requestUrl);
                        redirectUrl = `${urlObj.protocol}//${urlObj.host}${redirectUrl}`;
                    }
                    doRequest(redirectUrl, redirectCount + 1);
                    return;
                }

                if (response.statusCode !== 200) {
                    reject(new Error(`HTTP ${response.statusCode} for ${requestUrl}`));
                    return;
                }

                const chunks = [];
                response.on('data', (chunk) => chunks.push(chunk));
                response.on('end', () => resolve(Buffer.concat(chunks)));
                response.on('error', reject);
            }).on('error', reject);
        };

        doRequest(url);
    });
}

const migrateImagesToStorage = async () => {
    try {
        if (!db) {
            console.error("Firebase not initialized");
            process.exit(1);
        }
        console.log("Connected to Firestore and Storage...");

        const bucket = admin.storage().bucket();
        const productsRef = db.collection("products");
        const snapshot = await productsRef.get();

        console.log(`Analyzing ${snapshot.size} products...`);
        let migratedCount = 0;
        let skippedCount = 0;

        for (const doc of snapshot.docs) {
            const data = doc.data();
            const imageUrl = data.image;

            // Skip if no image or already in Firebase Storage
            if (!imageUrl) {
                skippedCount++;
                continue;
            }

            if (imageUrl.includes('firebasestorage.googleapis.com')) {
                console.log(`  Skipping (already in Firebase): ${data.name}`);
                skippedCount++;
                continue;
            }

            // Handle local paths or external URLs
            let downloadUrl = imageUrl;
            // If it starts with /products/, it's a local public path (relative to client)
            // For the purpose of this script, we assume those haven't been uploaded yet.
            // But wait, where are those files? They are in client/public/products.
            if (imageUrl.startsWith('/products/')) {
                console.log(`  Migrating local path: ${imageUrl}`);
                try {
                    const localFilePath = path.join(PUBLIC_DIR, imageUrl);
                    if (fs.existsSync(localFilePath)) {
                        const imageBuffer = fs.readFileSync(localFilePath);
                        const filename = `inventory/${Date.now()}_${slugify(data.name)}.jpg`;
                        const file = bucket.file(filename);

                        await file.save(imageBuffer, {
                            metadata: { contentType: 'image/jpeg' },
                        });

                        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filename)}?alt=media`;
                        await doc.ref.update({ image: publicUrl });
                        console.log(`    DONE (local) -> ${publicUrl}`);
                        migratedCount++;
                    } else {
                        console.log(`    FAILED: Local file not found at ${localFilePath}`);
                        skippedCount++;
                    }
                } catch (err) {
                    console.error(`    FAILED to migrate local image ${data.name}: ${err.message}`);
                }
                continue;
            }

            console.log(`  Migrating: ${data.name} (${imageUrl.substring(0, 50)}...)`);

            try {
                const imageBuffer = await fetchImage(downloadUrl);
                const filename = `inventory/${Date.now()}_${slugify(data.name)}.jpg`;
                const file = bucket.file(filename);

                await file.save(imageBuffer, {
                    metadata: {
                        contentType: 'image/jpeg',
                    },
                });

                // Get public URL
                // Note: getDownloadURL is for client SDK. For admin SDK, we can use getSignedUrl 
                // but usually user wants a permanent public link.
                // We'll use the firebasestorage link format.
                const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filename)}?alt=media`;

                await doc.ref.update({ image: publicUrl });
                console.log(`    DONE -> ${publicUrl}`);
                migratedCount++;
            } catch (err) {
                console.error(`    FAILED to migrate ${data.name}: ${err.message}`);
            }
        }

        console.log("-----------------------------------------");
        console.log(`SUMMARY:`);
        console.log(`  Migrated: ${migratedCount}`);
        console.log(`  Skipped:  ${skippedCount}`);
        console.log(`Total processed: ${snapshot.size}`);
        console.log("-----------------------------------------");
        process.exit(0);
    } catch (error) {
        console.error("Migration fatal error:", error);
        process.exit(1);
    }
};

migrateImagesToStorage();
