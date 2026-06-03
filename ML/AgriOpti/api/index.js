import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/auth.js";
import MssgRoute from "./routes/mssg.js";
import ProductRoute from "./routes/product.js";
import OrderRoute from "./routes/order.js";
import ttsRoute from "./routes/tts.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "./utils/logger.js";
import { db } from "./utils/firebase.js";

const app = express();
dotenv.config();

if (!db) {
    logger.warn("Firestore Database instance is not available. API might fail dynamically.");
}

// Database connection has been migrated to utils/firebase.js

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/mssg", MssgRoute);
app.use("/api/product", ProductRoute);
app.use("/api/order", OrderRoute);
app.use("/api/tts", ttsRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";

    logger.error(`${errorStatus} - ${errorMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    if (err.stack) logger.error(err.stack);

    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
});

const PORT = process.env.PORT || 8100;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
