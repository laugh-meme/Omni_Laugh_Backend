
import { Router } from 'express';
import { fetchAllWalletConnectionsController, fetchWalletConnectionsController } from '../controllers/walletConnection.controller.ts';

const router = Router();

router.get('/', fetchWalletConnectionsController);
router.get('/all', fetchAllWalletConnectionsController);


export default router;