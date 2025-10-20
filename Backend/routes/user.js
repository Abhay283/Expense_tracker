import express from "express";
import { login, register, dashboard, getAllUsers } from "../controllers/user.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/dashboard", authMiddleware, dashboard);
router.get("/users", getAllUsers);

export default router;
