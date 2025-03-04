import express from 'express';
import { sendNotification } from "../controllers/notify.controller.js";

const router = express.Router();

router.post("/send-notification", sendNotification)

export default router;