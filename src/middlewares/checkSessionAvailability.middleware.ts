import type { Request, Response, NextFunction } from 'express';

import { verifyMessageSignature as verifyMessageService } from '../services/auth/verifyMessageSignature.service.ts';
import { CHAIN_CONFIG } from '../configs/chain.config.ts';
import { checkSessionAvailabilityService } from '../services/auth/session.service.ts';
import AppError from '../errors/AppError.error.ts';

export const checkSessionAvailabilityMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const availability = await checkSessionAvailabilityService(req);
        if (!availability) throw new AppError( 
            'No session found.',
            401,
            'NO_SESSION'
        );
        next();
    } catch (err) {
        next(err);
    }
};
