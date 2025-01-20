import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { createMedia } from '../controllers/media.controller.js';
const router = Router();
router.post("/create-media/:watchPartyId", authenticate, createMedia);
export default router;
