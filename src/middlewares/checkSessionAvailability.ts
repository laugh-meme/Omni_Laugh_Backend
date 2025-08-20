// middleware/verifyMessageSignature.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import { verifyMessageSignature as verifyMessageService } from '../services/auth/verifyMessageSignature.service.ts';
import { CHAIN_CONFIG } from '../configs/chain.config.ts';
import { checkSessionAvailabilityService } from '../services/auth/session.service.ts';

export const checkSessionAvailabilityMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const availability = await checkSessionAvailabilityService(req);
        if (!availability) return res.status(401).json({ 
            message: 'No session found.',
            code: 'NO_SESSION'
        });

        next();
    } catch {
        res.status(500).json({ error: 'Internal server error' });
    }
};
