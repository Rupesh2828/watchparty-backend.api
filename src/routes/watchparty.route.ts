import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { createWatchParty,getWatchPartyById } from "../controllers/watchparty.controller.js";

const router = Router()

router.post("/create-watchparty",authenticate, createWatchParty)
router.get("/getwatchparty/:id",authenticate, getWatchPartyById)

export default router;