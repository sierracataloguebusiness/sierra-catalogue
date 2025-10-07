import express from 'express';
import {postApplication} from "../controllers/vendorApplicationController.js";

const router = express.Router();

router.post("/post-vendor-application", postApplication)

export default router;