
import { Router } from 'express';
import { fetchAllWalletConnectionsController, fetchWalletConnectionsController, putWalletConnectionController } from '../controllers/walletConnection.controller.ts';

const router = Router();

router.post('/put', putWalletConnectionController);
router.get('/', fetchWalletConnectionsController);
router.get('/all', fetchAllWalletConnectionsController);


export default router;