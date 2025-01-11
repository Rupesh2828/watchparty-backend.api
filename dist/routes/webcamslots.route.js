import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { createWebcamSlot } from "../controllers/webCamSlotController.js";
const router = Router();
router.post("/create-webcamslot", authenticate, createWebcamSlot);
export default router;
