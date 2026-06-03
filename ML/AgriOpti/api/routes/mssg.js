import express from "express";
import { createMessage, getMessages, getUserMessages } from "../controllers/MssgController.js";
import { verifyToken, verifyRole } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/create-message", verifyToken, createMessage);
router.get("/:user", verifyToken, getUserMessages);
router.get("/", verifyToken, getMessages);

export default router;
