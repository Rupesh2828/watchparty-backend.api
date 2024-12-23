import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { createWatchParty,getWatchPartyById , updateWatchpartyDetails, deleteWatchparty } from "../controllers/watchparty.controller.js";

const router = Router()

router.post("/create-watchparty",authenticate, createWatchParty)
router.get("/getwatchparty/:id",authenticate, getWatchPartyById)
router.post("/update-details/:id",authenticate, updateWatchpartyDetails)
router.post("/delete-watchparty/:id",authenticate, deleteWatchparty)

export default router;