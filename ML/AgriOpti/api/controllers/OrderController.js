import { orderSchema } from "../utils/validation.js";
import logger from "../utils/logger.js";
import { createError } from "../utils/error.js";
import { orderCache } from "../utils/cache.js";
import { db, admin } from "../utils/firebase.js";

// Helper to map snapshot to array
const mapSnapshot = (snapshot) => {
    return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
};

// Create a new order
export const createOrder = async (req, res, next) => {
    try {
        if (!db) return next(createError(500, "Database not connected"));
        const validatedData = orderSchema.parse(req.body);

        const newOrder = {
            ...validatedData,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const ordersRef = db.collection("orders");
        const addedDocRef = await ordersRef.add(newOrder);
        newOrder._id = addedDocRef.id;

        orderCache.clear(); // Invalidate on new order
        logger.info(`Order created: ${addedDocRef.id} by user ${validatedData.user}`);
        return res.status(200).json({ message: "Order created successfully", order: newOrder });
    } catch (err) {
        if (err.name === "ZodError") return res.status(400).json({ success: false, errors: err.errors });
        next(err);
    }
};

export const getAllOrders = async (req, res, next) => {
    try {
        if (!db) return next(createError(500, "Database not connected"));
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const cacheKey = `orders_all_p${page}_l${limit}`;

        const cached = orderCache.get(cacheKey);
        if (cached) return res.status(200).json(cached);

        const snapshot = await db.collection("orders").orderBy("createdAt", "desc").get();
        const allOrders = mapSnapshot(snapshot);

        const total = allOrders.length;
        const orders = allOrders.slice((page - 1) * limit, page * limit);

        const response = {
            message: "Orders retrieved successfully",
            orders,
            pagination: { total, page, pages: Math.ceil(total / limit) }
        };

        orderCache.set(cacheKey, response);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
};

export const getAllOrdersByUser = async (req, res, next) => {
    try {
        if (!db) return next(createError(500, "Database not connected"));
        const { userId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const cacheKey = `orders_user_${userId}_p${page}_l${limit}`;

        const cached = orderCache.get(cacheKey);
        if (cached) return res.status(200).json(cached);

        const snapshot = await db.collection("orders").where("user", "==", userId).get();
        let allOrders = mapSnapshot(snapshot);
        allOrders.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));

        const total = allOrders.length;
        const orders = allOrders.slice((page - 1) * limit, page * limit);

        const response = {
            message: "Orders retrieved successfully",
            orders,
            pagination: { total, page, pages: Math.ceil(total / limit) }
        };

        orderCache.set(cacheKey, response);
        return res.status(200).json(response);
    } catch (err) {
        next(err);
    }
};