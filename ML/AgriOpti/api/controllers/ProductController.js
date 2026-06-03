import { productSchema } from "../utils/validation.js";
import logger from "../utils/logger.js";
import { createError } from "../utils/error.js";
import { productCache } from "../utils/cache.js";
import { db, admin } from "../utils/firebase.js";

// Helper to map snapshot to array
const mapSnapshot = (snapshot) => {
    return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
};

// Create a new product
export const createProduct = async (req, res, next) => {
    try {
        if (!db) return next(createError(500, "Database not connected"));
        const validatedData = productSchema.parse(req.body);

        const newProduct = {
            ...validatedData,
            sale: req.body.sale || 0,
            rating: req.body.rating || 0,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const productsRef = db.collection("products");
        const addedDocRef = await productsRef.add(newProduct);
        newProduct._id = addedDocRef.id;

        productCache.clear(); // Invalidate cache on new product
        logger.info(`Product created: ${addedDocRef.id} by user ${validatedData.user}`);
        return res.status(200).json({ message: "Product created successfully", product: newProduct });
    } catch (err) {
        if (err.name === "ZodError") {
            const errorDetails = JSON.stringify(err.errors, null, 2);
            logger.error(`Zod validation error in createProduct: ${errorDetails}`);
            console.error("Zod Validation Details:", errorDetails); // Log to console for user to see in terminal
            return res.status(400).json({ success: false, message: "Validation failed", errors: err.errors });
        }
        logger.error(`Error in createProduct: ${err.message}`);
        console.error("CreateProduct Error:", err);
        next(err);
    }
};

// Update stock value
export const updateStock = async (req, res, next) => {
    try {
        if (!db) return next(createError(500, "Database not connected"));
        const { productId, newStock } = req.body;

        const productRef = db.collection("products").doc(productId);
        const productSnap = await productRef.get();
        if (!productSnap.exists) return next(createError(404, "Product not found"));

        await productRef.update({
            stock: admin.firestore.FieldValue.increment(newStock),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        productCache.clear();

        const updatedSnap = await productRef.get();
        return res.status(200).json({ message: "Stock updated successfully", product: { _id: updatedSnap.id, ...updatedSnap.data() } });
    } catch (err) {
        logger.error(`Error in updateStock: ${err.message}`);
        console.error("UpdateStock Error:", err);
        next(err);
    }
};

export const updateSale = async (req, res, next) => {
    try {
        if (!db) return next(createError(500, "Database not connected"));
        const { productId, sale } = req.body;

        const productRef = db.collection("products").doc(productId);
        const productSnap = await productRef.get();
        if (!productSnap.exists) return next(createError(404, "Product not found"));

        await productRef.update({
            sale,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        productCache.clear();

        const updatedSnap = await productRef.get();
        return res.status(200).json({ message: "Sale updated successfully", product: { _id: updatedSnap.id, ...updatedSnap.data() } });
    } catch (err) {
        next(err);
    }
};

export const updateStockAndSale = async (req, res, next) => {
    try {
        if (!db) return next(createError(500, "Database not connected"));
        const { productId, newStock, sale } = req.body;

        const productRef = db.collection("products").doc(productId);
        const productSnap = await productRef.get();
        if (!productSnap.exists) return next(createError(404, "Product not found"));

        await productRef.update({
            stock: admin.firestore.FieldValue.increment(newStock),
            sale,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        productCache.clear();

        const updatedSnap = await productRef.get();
        return res.status(200).json({ message: "Stock and sale updated successfully", product: { _id: updatedSnap.id, ...updatedSnap.data() } });
    } catch (err) {
        next(err);
    }
};

export const getAllProducts = async (req, res, next) => {
    try {
        if (!db) return next(createError(500, "Database not connected"));
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const cacheKey = `products_all_p${page}_l${limit}`;

        const cached = productCache.get(cacheKey);
        if (cached) return res.status(200).json(cached);

        const productsRef = db.collection("products");
        // Firestore pagination requires cursors usually, but for simple offset logic we fetch more and slice if needed, 
        // OR just fetch all and slice (since skip() is not native without cursors). 
        // For efficiency in small DBs, fetch all and slice. 
        const snapshot = await productsRef.orderBy("createdAt", "desc").get();
        const allProducts = mapSnapshot(snapshot);

        const total = allProducts.length;
        const products = allProducts.slice((page - 1) * limit, page * limit);

        const response = {
            message: "Products retrieved successfully",
            products,
            pagination: { total, page, pages: Math.ceil(total / limit) }
        };

        productCache.set(cacheKey, response);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
};

export const getAllProductsByUser = async (req, res, next) => {
    try {
        if (!db) return next(createError(500, "Database not connected"));
        const { userId } = req.params;
        const cacheKey = `products_user_${userId}`;
        const cached = productCache.get(cacheKey);
        if (cached) return res.status(200).json(cached);

        const snapshot = await db.collection("products").where("user", "==", userId).get();
        // Native sort on a different field requires a composite index, doing in-memory sort for now
        let products = mapSnapshot(snapshot);
        products.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));

        const response = { message: "Products retrieved successfully", products };
        productCache.set(cacheKey, response);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
};

const getProductsByField = async (field, value, res, next) => {
    try {
        if (!db) return next(createError(500, "Database not connected"));
        const cacheKey = `products_${field}_${value}`;
        const cached = productCache.get(cacheKey);
        if (cached) return res.status(200).json(cached);

        const snapshot = await db.collection("products").where(field, "==", value).get();
        const products = mapSnapshot(snapshot);

        const response = { message: "Products retrieved successfully", products };
        productCache.set(cacheKey, response);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
};

export const getProductsByType = (req, res, next) => getProductsByField('productType', 'pesticides', res, next);
export const getProductsByType2 = (req, res, next) => getProductsByField('productType', 'tools', res, next);
export const getProductsByType3 = (req, res, next) => getProductsByField('productType', 'crops', res, next);
export const getProductsByTypeFertilizers = (req, res, next) => getProductsByField('productType', 'fertilizers', res, next);
export const getProductsByTypeMachinery = (req, res, next) => getProductsByField('productType', 'machinery', res, next);
export const getProductsByTypeIrrigation = (req, res, next) => getProductsByField('productType', 'irrigation', res, next);
export const getProductsByTypeGreenhouses = (req, res, next) => getProductsByField('productType', 'greenhouses', res, next);
export const getProductsByTypeHarvesting = (req, res, next) => getProductsByField('productType', 'harvesting', res, next);
export const getProductsByTypeTransport = (req, res, next) => getProductsByField('productType', 'transport', res, next);
