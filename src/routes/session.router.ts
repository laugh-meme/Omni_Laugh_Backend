
import { Router } from 'express';
import { checkSessionAvailabilityController, createSessionController, fetchSessionController, nonceController } from '../controllers/session.controller.ts';

const router = Router();

router.post('/create_session', createSessionController);
router.get('/check_session', checkSessionAvailabilityController);
router.get('/nonce', nonceController);
router.get('/fetch_session', fetchSessionController)


export default router;