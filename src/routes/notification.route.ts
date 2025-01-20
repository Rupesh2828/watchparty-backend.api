import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { getUserNotifications, notifyWatchPartyStart } from '../controllers/notification.controller.js';

const router = Router();

router.post("/watchparty/:watchPartyId/notify", authenticate, notifyWatchPartyStart)
router.get("/user/:userId/notifications", authenticate, getUserNotifications)

export default router;
