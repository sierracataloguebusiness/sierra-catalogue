import express from "express";
import { createMessage, getMessages } from "../controllers/contactMessageController.js";
import {authorize} from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", createMessage);
router.get("/", authorize('admin'), getMessages);

export default router;