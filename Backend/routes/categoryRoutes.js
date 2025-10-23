import express from "express";
import { getAllCategories, addCategory } from "../controllers/categoryController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getAllCategories);
router.post("/", verifyToken, addCategory);

export default router;
