import express from "express";
import { register, login } from "../controllers/LoginLogout-controller";
import { listThread } from "../controllers/thread-controller";
import { authMiddleware } from "../middlewares/auth";
import { createThreadController } from "../controllers/create-controller";
import { upload } from "../utils/multer";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/thread", authMiddleware, listThread);
router.post("/thread", authMiddleware, upload.single("image"), createThreadController);

export default router;
