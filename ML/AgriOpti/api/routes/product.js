import express from "express";
import { createProduct, updateStock, updateSale, getProductsByType, getProductsByType2, getProductsByType3, getProductsByTypeFertilizers, getProductsByTypeMachinery, getProductsByTypeIrrigation, getProductsByTypeGreenhouses, getProductsByTypeHarvesting, getProductsByTypeTransport, getAllProducts, updateStockAndSale, getAllProductsByUser } from "../controllers/ProductController.js";
import { verifyRole, verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/create-product", verifyRole(["retailer", "government", "admin", "farmer"]), createProduct);
router.get("/", getAllProducts);
router.get("/user/:userId", verifyToken, getAllProductsByUser);
router.get("/pesticides", getProductsByType);
router.get("/tools", getProductsByType2);
router.get("/crops", getProductsByType3);
router.get("/fertilizers", getProductsByTypeFertilizers);
router.get("/machinery", getProductsByTypeMachinery);
router.get("/irrigation", getProductsByTypeIrrigation);
router.get("/greenhouses", getProductsByTypeGreenhouses);
router.get("/harvesting", getProductsByTypeHarvesting);
router.get("/transport", getProductsByTypeTransport);
router.post("/update-stock", verifyRole(["retailer", "government", "admin", "farmer"]), updateStock);
router.post("/update-stock&sale", verifyRole(["retailer", "government", "admin", "farmer"]), updateStockAndSale);
router.put("/update-sale", verifyRole(["retailer", "government", "admin", "farmer"]), updateSale);

export default router;