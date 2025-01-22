import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { createReaction, deleteReaction, getAllReactions } from "../controllers/reaction.controller.js";

const router = Router()

router.post("/:watchPartyId/create-reaction",authenticate, createReaction)
router.get("/:watchPartyId/get-all-reactions", authenticate, getAllReactions)
router.delete("/:watchPartyId/delete-reaction", authenticate, deleteReaction)




export default router;