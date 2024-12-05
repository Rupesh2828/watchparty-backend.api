import { Router } from 'express';
import { createUser } from '../controllers/user.controller';

const router = Router();

router.route('/register').post(createUser);

export default router;
