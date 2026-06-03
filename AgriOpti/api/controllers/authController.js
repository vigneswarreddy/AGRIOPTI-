import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../utils/validation.js";
import logger from "../utils/logger.js";
import { db } from "../utils/firebase.js";
import { admin } from "../utils/firebase.js";

export const register = async (req, res, next) => {
    try {
        if (!db) return next(createError(500, "Database not connected"));
        const validatedData = registerSchema.parse(req.body);

        const usersRef = db.collection("users");
        // Check if email already exists
        const existing = await usersRef.where("email", "==", validatedData.email).limit(1).get();
        if (!existing.empty) {
            return next(createError(400, "Email already exists"));
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(validatedData.password, salt);

        const newUserRef = usersRef.doc();
        const newUserData = {
            name: validatedData.name,
            email: validatedData.email,
            password: hash,
            role: validatedData.role,
            preferredLanguage: validatedData.preferredLanguage,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await newUserRef.set(newUserData);
        logger.info(`New user registered: ${validatedData.email} with id: ${newUserRef.id}`);

        return res.status(200).json({ message: "User has been created", userId: newUserRef.id });
    } catch (err) {
        if (err.name === "ZodError") return res.status(400).json({ success: false, errors: err.errors });
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        if (!db) return next(createError(500, "Database not connected"));
        const validatedData = loginSchema.parse(req.body);

        const usersRef = db.collection("users");
        const userSnapshot = await usersRef.where("email", "==", validatedData.email).limit(1).get();
        if (userSnapshot.empty) {
            return next(createError(404, "User not found!"));
        }

        const userDoc = userSnapshot.docs[0];
        const user = userDoc.data();
        const userId = userDoc.id;

        if (user.role !== validatedData.role) {
            return next(createError(403, "Invalid role for this account!"));
        }

        const isPasswordCorrect = await bcrypt.compare(validatedData.password, user.password);
        if (!isPasswordCorrect) {
            return next(createError(400, "Wrong password or username!"));
        }

        const token = jwt.sign({ id: userId, role: user.role, preferredLanguage: user.preferredLanguage }, process.env.JWT, { expiresIn: "1d" });

        const { password, ...otherDetails } = user;

        logger.info(`User logged in: ${user.email}`);

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        })
            .status(200)
            .json({ ...otherDetails, _id: userId });
    } catch (err) {
        if (err.name === "ZodError") return res.status(400).json({ success: false, errors: err.errors });
        next(err);
    }
};

export const logout = (req, res) => {
    res.clearCookie("access_token")
        .status(200)
        .json({ message: "Logged out successfully" });
};

export const AllUser = async (req, res, next) => {
    try {
        if (!db) return next(createError(500, "Database not connected"));
        const snapshot = await db.collection("users").get();
        const users = snapshot.docs.map(doc => {
            const data = doc.data();
            delete data.password;
            return { _id: doc.id, ...data };
        });
        return res.status(200).json({ users });
    } catch (err) {
        next(err);
    }
};

export const getAllRetailers = async (req, res, next) => {
    try {
        if (!db) return next(createError(500, "Database not connected"));
        const snapshot = await db.collection("users").where("role", "==", "retailer").get();
        const retailers = snapshot.docs.map(doc => {
            const data = doc.data();
            delete data.password;
            return { _id: doc.id, ...data };
        });
        return res.status(200).json({ message: "Retailers retrieved successfully", retailers });
    } catch (err) {
        next(err);
    }
};

export const getAllGovernment = async (req, res, next) => {
    try {
        if (!db) return next(createError(500, "Database not connected"));
        const snapshot = await db.collection("users").where("role", "==", "government").get();
        const governments = snapshot.docs.map(doc => {
            const data = doc.data();
            delete data.password;
            return { _id: doc.id, ...data };
        });
        return res.status(200).json({ message: "Government retrieved successfully", governments });
    } catch (err) {
        next(err);
    }
};
