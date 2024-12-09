import { Router } from 'express';
import { createUser, loginUser, logoutUser } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
const router = Router();
router.route('/register').post(createUser);
router.route('/login').post(loginUser);
router.route('/logout').post(authenticate, logoutUser);
export default router;
