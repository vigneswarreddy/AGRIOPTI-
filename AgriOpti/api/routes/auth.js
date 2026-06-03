import express from "express";
import { register, login, logout, AllUser, getAllRetailers, getAllGovernment } from "../controllers/authController.js";
import { verifyRole } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes
router.get("/", verifyRole(["admin"]), AllUser);
router.get("/retailers", getAllRetailers);
router.get("/governments", getAllGovernment);

export default router;
