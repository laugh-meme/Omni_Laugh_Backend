import { Router } from 'express';
import { xCallbackController, xLoginController, xRevokeControlller } from '../controllers/xAuthentication.controller.ts';
import { checkSessionAvailabilityMiddleware } from '../middlewares/checkSessionAvailability.middleware.ts';
import config from '../configs/config.ts';

const router = Router();

router.get("/login", xLoginController);
router.get("/revoke", () => {if (config.nodeEnv == 'production') checkSessionAvailabilityMiddleware}, xRevokeControlller);
router.get("/callback", xCallbackController);

export default router;