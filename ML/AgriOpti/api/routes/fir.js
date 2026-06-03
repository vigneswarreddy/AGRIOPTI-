import  express from "express";
import { createFir, deleteFir, getFir, getuserFir, updateFir, updateFir2, updateFir3 } from "../controllers/FirController.js";


const router=express.Router();

router.post("/create-fir",createFir)
router.get("/:user",getuserFir);
router.get("/",getFir);
router.delete("/:id",deleteFir);
router.put("/update/:id",updateFir);
router.put("/update2/:id",updateFir2);
router.put("/update3/:id",updateFir3);


export default router