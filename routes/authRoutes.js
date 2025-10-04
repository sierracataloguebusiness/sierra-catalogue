import express from 'express';
import {handleLogin, handleSignup} from '../controllers/authController.js';
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.get("/me", protect, (req, res) => {
    res.status(200).json({
        user: req.user,
    });
});

export default router;
