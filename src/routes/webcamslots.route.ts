
import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { createWebcamSlot, getWebcamSlotById, getAllWebcamSlots, updateWebcamSlot, deleteWebcamSlot } from "../controllers/webCamSlotController.js";

const router = Router()

router.post("/create-webcamslot", authenticate, createWebcamSlot)
router.get("/getwebcamslotsby-id/:id", authenticate, getWebcamSlotById)
router.get("/getallwebcamslot", authenticate, getAllWebcamSlots)
router.post("/updatewebcamslot/:id", authenticate, updateWebcamSlot)
router.delete("/delete-webcamslot/:id", authenticate, deleteWebcamSlot)



export default router;