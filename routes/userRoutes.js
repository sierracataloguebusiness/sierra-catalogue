import {Router} from "express";
import {changePassword, getProfile, updateProfile} from "../controllers/userController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/profile/password", protect, changePassword);

export default router;