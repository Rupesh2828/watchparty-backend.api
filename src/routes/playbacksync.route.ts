import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { createPlaybackSync } from '../controllers/playbacksync.controller.js';

const router = Router();

router.post("/create-playback/:watchPartyId", authenticate, createPlaybackSync)

export default router;
