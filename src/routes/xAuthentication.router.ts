
import { Router } from 'express';

import { xCallback, xLogin, xRevoke } from '../controllers/xAuthentication.controller.ts';

const router = Router();

router.get("/login", xLogin);
router.get("/revoke", xRevoke);
router.get("/callback", xCallback);

export default router;