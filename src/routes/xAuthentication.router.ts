import { Router } from 'express';
import { xCallbackController, xLoginController, xRevokeControlller } from '../controllers/xAuthentication.controller.ts';
import { checkSessionAvailabilityMiddleware } from '../middlewares/checkSessionAvailability.middleware.ts';

const router = Router();

router.get("/login", checkSessionAvailabilityMiddleware, xLoginController);
router.get("/revoke", checkSessionAvailabilityMiddleware, xRevokeControlller);
router.get("/callback", checkSessionAvailabilityMiddleware, xCallbackController);

export default router;