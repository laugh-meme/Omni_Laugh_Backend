import type { Request, Response, NextFunction } from "express"
import { verifyMessageSignature } from "../services/auth/verifyMessageSignature.service.ts";
import { consoleErrorIfDevMode } from "../utils/consoleLogging.ts";
import { checkSessionAvailabilityService, createSessionService, nonceService } from "../services/auth/session.service.ts";
import config from "../configs/config.ts";
import AppError from "../errors/AppError.error.ts";

export const createSessionController = async (req: Request, res: Response, next: NextFunction) => {
    try {   
        const { address, message, signature, nonce } = req.body;

        if (!address || !message || !signature || !nonce) throw new AppError(
            'Missigng parameters: address, message, signature, nonce.',
            400,
            'BAD_REQUEST'
        )

        const isVerified = await verifyMessageSignature({address, message, signature}, nonce);
        const isNonceMatched = req.session.nonce && req.session.nonce?.value == nonce || (config.nodeEnv == 'development' && true);
        const isNonceValid = req.session.nonce && req.session.nonce?.expiresAt > Date.now() || (config.nodeEnv == 'development' && true);

        if (!isVerified) throw new AppError(
            'Invalid signature. Please ensure the message and signature are correct.', 
            401,
            'INVALID_SIGNATURE'
        )
        else if (!isNonceMatched) throw new AppError(
            'Invalid nonce. Please ensure the nonce is correct.', 
            401,
            'INVALID_NONCE'
        )
        else if (!isNonceValid) throw new AppError(
            'Nonce expired. Please try again with new nonce.', 
            401,
            'EXPIRED_NONCE'
        )
        
        delete req.session.nonce;
        createSessionService(req, address);
        res.status(200).json({message: 'Session has been created!', code: 'SUCCESS'})
    } catch (err: unknown) {
        next(err);
    }
}

export const revokeSessionController = (req: Request, res: Response) => {
    try {
        
    } catch (err: unknown) {
        
    }
}

export const checkSessionAvailabilityController = (req: Request, res: Response, next: NextFunction) => {
    try {
        const availability = checkSessionAvailabilityService(req);
        res.status(200).json({
            data: availability,
            message: availability ? 'Session found.' : 'No session found.',
            code: availability ? 'SUCCESS' : 'NO_SESSION'
        })
    } catch (err: unknown) {
       next(err);
    }
}

export const nonceController = (req: Request, res: Response, next: NextFunction) => {
    try {
        const nonce = nonceService(req);
        res.status(200).json({
            data: nonce,
            message: 'Nonce created',
            code: 'SUCCESS'
        })
    } catch (err: unknown) {
        next(err);
    }
}

export const fetchSessionController = (req: Request, res: Response) => {
    if (config.nodeEnv == 'development') {
        res.status(200).send(req.session);
    } else {
        res.status(403)
    }
}