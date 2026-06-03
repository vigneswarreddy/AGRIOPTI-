import dotenv from 'dotenv';
import { db } from './utils/firebase.js';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';

dotenv.config();

const PRODUCTS_DIR = path.resolve('../client/public/products');

// Ensure directory exists
if (!fs.existsSync(PRODUCTS_DIR)) {
    fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
}

function slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;

        const doRequest = (requestUrl, redirectCount = 0) => {
            if (redirectCount > 5) {
                reject(new Error('Too many redirects'));
                return;
            }

            const proto = requestUrl.startsWith('https') ? https : http;
            proto.get(requestUrl, (response) => {
                // Handle redirects
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

                const fileStream = fs.createWriteStream(filepath);
                response.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    resolve();
                });
                fileStream.on('error', reject);
            }).on('error', reject);
        };

        doRequest(url);
    });
}

// All products with their current image URLs
const productImages = {
    // Seeds / Crops
    "Hybrid Tomato Seeds": "https://cdn.pixabay.com/photo/2016/08/11/08/43/potted-plant-1585418_640.jpg",
    "Premium Wheat Seeds": "https://cdn.pixabay.com/photo/2016/09/21/04/46/barley-field-1684052_640.jpg",
    "Golden Corn Seeds": "https://cdn.pixabay.com/photo/2018/09/02/09/41/corn-3648942_640.jpg",
    "Organic Rice Seeds": "https://cdn.pixabay.com/photo/2014/11/13/01/20/paddy-field-530156_640.jpg",
    "Spinach Seeds": "https://cdn.pixabay.com/photo/2016/09/10/17/47/spinach-1659476_640.jpg",
    "Cucumber Seeds": "https://cdn.pixabay.com/photo/2015/07/17/13/44/cucumbers-849269_640.jpg",
    "Sunflower Seeds": "https://cdn.pixabay.com/photo/2016/08/28/23/24/sunflower-1627193_640.jpg",
    "Chili Seeds": "https://cdn.pixabay.com/photo/2016/11/06/01/08/red-chili-1801904_640.jpg",
    "Carrot Seeds": "https://cdn.pixabay.com/photo/2017/05/23/22/49/carrots-2338824_640.jpg",
    "Pumpkin Seeds": "https://cdn.pixabay.com/photo/2017/10/09/18/25/pumpkin-2834511_640.jpg",

    // Pesticides
    "Neem Oil Pesticide": "https://cdn.pixabay.com/photo/2020/06/20/01/07/sprayer-5319812_640.jpg",
    "Insect Guard Spray": "https://cdn.pixabay.com/photo/2018/07/12/21/32/plant-protection-3534244_640.jpg",
    "Crop Defender Liquid": "https://cdn.pixabay.com/photo/2017/08/06/10/36/agriculture-2591545_640.jpg",
    "Bio Pest Control": "https://cdn.pixabay.com/photo/2015/03/14/14/28/ladybug-674125_640.jpg",
    "Fungus Shield": "https://cdn.pixabay.com/photo/2017/02/07/11/45/leaf-2045210_640.jpg",
    "Weed Terminator": "https://cdn.pixabay.com/photo/2016/07/28/06/28/agriculture-1547006_640.jpg",
    "Plant Protect Plus": "https://cdn.pixabay.com/photo/2020/05/24/04/47/field-5213665_640.jpg",
    "Crop Guard Concentrate": "https://cdn.pixabay.com/photo/2017/09/01/13/56/university-of-agriculture-2704999_640.jpg",
    "Eco Pest Solution": "https://cdn.pixabay.com/photo/2014/04/14/20/11/agriculture-324175_640.jpg",
    "Leaf Armor Spray": "https://cdn.pixabay.com/photo/2016/11/29/04/00/agriculture-1867602_640.jpg",

    // Tools
    "Steel Hand Hoe": "https://cdn.pixabay.com/photo/2017/08/02/01/31/garden-2569745_640.jpg",
    "Farm Shovel": "https://cdn.pixabay.com/photo/2017/07/24/02/40/garden-2533266_640.jpg",
    "Pruning Shears": "https://cdn.pixabay.com/photo/2018/04/15/23/38/pruning-shears-3323682_640.jpg",
    "Garden Rake": "https://cdn.pixabay.com/photo/2014/06/11/17/00/autumn-366464_640.jpg",
    "Hand Trowel": "https://cdn.pixabay.com/photo/2016/08/11/08/43/potted-plant-1585418_640.jpg",
    "Soil Cultivator": "https://cdn.pixabay.com/photo/2015/05/07/11/26/garden-756711_640.jpg",
    "Garden Fork": "https://cdn.pixabay.com/photo/2016/03/26/22/21/garden-1281105_640.jpg",
    "Weeding Tool": "https://cdn.pixabay.com/photo/2017/05/09/03/46/gardening-2297212_640.jpg",
    "Planting Dibber": "https://cdn.pixabay.com/photo/2020/04/19/08/17/watermelon-5062905_640.jpg",
    "Garden Knife": "https://cdn.pixabay.com/photo/2014/12/11/02/55/cereals-563796_640.jpg",
};

const downloadAndUpdate = async () => {
    try {
        if (!db) {
            console.error("Firebase not initialized");
            process.exit(1);
        }
        console.log("Connected to Firestore...");
        console.log(`Downloading ${Object.keys(productImages).length} images to ${PRODUCTS_DIR}...\n`);

        // Download all images
        for (const [name, url] of Object.entries(productImages)) {
            const filename = `${slugify(name)}.jpg`;
            const filepath = path.join(PRODUCTS_DIR, filename);

            try {
                process.stdout.write(`  Downloading: ${name}...`);
                await downloadImage(url, filepath);
                // Verify file was written
                const stats = fs.statSync(filepath);
                console.log(` OK (${Math.round(stats.size / 1024)}KB)`);
            } catch (err) {
                console.log(` FAILED: ${err.message}`);
            }
        }

        console.log("\nUpdating Firebase with local paths...");

        // Update Firebase
        const productsRef = db.collection("products");
        const snapshot = await productsRef.get();
        const batch = db.batch();
        let updatedCount = 0;

        snapshot.docs.forEach((doc) => {
            const data = doc.data();
            if (productImages[data.name]) {
                const filename = `${slugify(data.name)}.jpg`;
                const localPath = `/products/${filename}`;
                batch.update(doc.ref, { image: localPath });
                updatedCount++;
            }
        });

        if (updatedCount > 0) {
            await batch.commit();
        }

        console.log("-----------------------------------------");
        console.log(`SUCCESS: Downloaded ${Object.keys(productImages).length} images`);
        console.log(`SUCCESS: Updated ${updatedCount} products in Firebase`);
        console.log(`Images saved to: ${PRODUCTS_DIR}`);
        console.log("-----------------------------------------");
        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

downloadAndUpdate();
