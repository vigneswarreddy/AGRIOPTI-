import express from "express";
import { createOrder, getAllOrders, getAllOrdersByUser } from "../controllers/OrderController.js";
import { verifyToken, verifyRole } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/create-order", verifyToken, createOrder);
router.get("/", verifyRole(["admin", "government"]), getAllOrders);
router.get("/user/:userId", verifyToken, getAllOrdersByUser);

export default router;
