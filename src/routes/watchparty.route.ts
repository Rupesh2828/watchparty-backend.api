import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { createWatchParty,getWatchPartyById , updateWatchpartyDetails, deleteWatchparty, addParticipantToWatchParty, removeParticipantFromWatchParty, startStreaming, endWatchPartyLive} from "../controllers/watchparty.controller.js";

const router = Router()

router.post("/create-watchparty",authenticate, createWatchParty)
router.get("/getwatchparty/:id",authenticate, getWatchPartyById)
router.post("/update-details/:id",authenticate, updateWatchpartyDetails)
router.post("/delete-watchparty/:id",authenticate, deleteWatchparty)
router.post("/add-participants/:id",authenticate, addParticipantToWatchParty)
router.post("/remove-participants/:id",authenticate, removeParticipantFromWatchParty)
router.post("/live-stream/:id",authenticate, startStreaming)
router.post("/end-live-stream/:id",authenticate, endWatchPartyLive)

export default router;