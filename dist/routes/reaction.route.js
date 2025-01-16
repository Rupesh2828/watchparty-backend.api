import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { createReaction } from "../controllers/reaction.controller.js";
const router = Router();
router.post("/:id/create-reaction", authenticate, createReaction);
export default router;
