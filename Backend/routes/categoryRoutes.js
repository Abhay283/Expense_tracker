import express from "express";
import { getAllCategories, addCategory } from "../controllers/categoryController.js";
import  authenticationMiddleware  from "../middleware/auth.js";

const router = express.Router();

router.get("/categories", authenticationMiddleware, getAllCategories);
router.post("/", authenticationMiddleware, addCategory);

export default router;
