import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { createChatMessages } from "../controllers/chatmessages.controller.js";

const router = Router()

router.post("/create-messages", authenticate,createChatMessages)




export default router;