import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { createWatchParty } from "../controllers/watchparty.controller.js";

const router = Router()

router.route("/create-watchparty").post(authenticate, createWatchParty)

export default router;