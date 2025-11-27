import express from "express";
import { register, login } from "../controllers/LoginLogout-controller";
import { listThread, getThreadDetailController } from "../controllers/thread-controller";
import { authMiddleware } from "../middlewares/auth";
import { createThreadController } from "../controllers/create-controller";
import { upload } from "../utils/multer";
import { createReplyController, getRepliesController } from "../controllers/reply-controller";
import { getProfileController, updateProfileController } from "../controllers/profile-controller";
import { followUserController, getFollowsController, unfollowUserController } from "../controllers/follow-controller";
import { getSuggestedUsersController } from "../controllers/suggested-controller";
import { searchUsersController } from "../controllers/user-controller";
import { getLikeStatus, likeThread } from "../controllers/likes-controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/thread", authMiddleware, listThread);
router.post("/thread", authMiddleware, upload.single("image"), createThreadController);
router.get("/thread/:id", authMiddleware, getThreadDetailController);
router.post("/reply", authMiddleware, upload.single("image"), createReplyController);
router.get("/reply", authMiddleware, getRepliesController);
router.get("/profile", authMiddleware, getProfileController);
router.patch("/profile", authMiddleware, upload.single("photo_profile"), updateProfileController);
router.get("/follows", authMiddleware, getFollowsController);
router.post("/follows", authMiddleware, followUserController);
router.delete("/follows", authMiddleware, unfollowUserController);
router.get("/suggested", authMiddleware, getSuggestedUsersController);
router.get("/users/search", authMiddleware, searchUsersController);
router.post("/like", authMiddleware, likeThread);
router.get("/like/status", authMiddleware, getLikeStatus);

export default router;
