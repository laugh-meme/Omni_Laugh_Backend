import type { Request, Response } from "express"
import { verifyMessageSignature } from "../services/auth/verifyMessageSignature.service.ts";
import { consoleErrorIfDevMode } from "../utils/consoleLogging.ts";
import { checkSessionAvailabilityService, createSessionService, nonceService } from "../services/auth/session.service.ts";
import config from "../configs/config.ts";

export const createSessionController = async (req: Request, res: Response) => {
    try {   
        const { address, message, signature, nonce } = req.body;

        if (!address || !message || !signature || !nonce) return res.status(400).json({
            message: 'Missigng parameters: address, message, signature, nonce.',
            code: 'BAD_REQUEST',
        })

        const isVerified = await verifyMessageSignature({address, message, signature}, nonce);
        const isNonceMatched = req.session.nonce && req.session.nonce?.value == nonce
        const isNonceValid = req.session.nonce && req.session.nonce?.expiresAt > Date.now();
        if (!isVerified) return res.status(401).json({
            message: 'Invalid signature. Please ensure the message and signature are correct.', 
            code: 'INVALID_SIGNATURE'
        })
        else if (!isNonceMatched) return res.status(401).json({
            message: 'Invalid nonce. Please ensure the nonce is correct.', 
            code: 'INVALID_NONCE'
        })
        else if (!isNonceValid) return res.status(401).json({
            message: 'Nonce expired. Please ensure the nonce is not expired.', 
            code: 'EXPIRED_NONCE'
        })
        
        delete req.session.nonce;
        createSessionService(req, address);
        res.status(200).json({message: 'Session has been created!', code: 'SUCCESS'})
    } catch (err: unknown) {
        consoleErrorIfDevMode(err);
        res.status(500).json({
            error: err ,
            message: 'An unexpected error occurred. Please try again later.',
            code: 'SERVER_ERROR'
        });
    }
}

export const revokeSessionController = (req: Request, res: Response) => {
    try {
        
    } catch (err: unknown) {
        
    }
}

export const checkSessionAvailabilityController = (req: Request, res: Response) => {
    try {
        const availability = checkSessionAvailabilityService(req);
        res.status(200).json({
            data: availability,
            message: availability ? 'Session found.' : 'No session found.',
            code: availability ? 'SUCCESS' : 'NO_SESSION'
        })
    } catch (err: unknown) {
        consoleErrorIfDevMode(err);
        res.status(500).json({
            error: err,
            message: 'An unexpected error occurred. Please try again later.',
            code: 'SERVER_ERROR'
        });
    }
}

export const nonceController = (req: Request, res: Response) => {
    try {
        const nonce = nonceService(req);
        console.log(nonce);
        res.status(200).json({
            data: nonce,
            message: 'Nonce created',
            code: 'SUCCESS'
        })
    } catch (err: unknown) {
        consoleErrorIfDevMode(err);
        res.status(500).json({
            error: err,
            message: 'An unexpected error occurred. Please try again later.',
            code: 'SERVER_ERROR'
        });
    }
}

export const fetchSessionController = (req: Request, res: Response) => {
    if (config.nodeEnv == 'development') {
        res.status(200).send(req.session);
    } else {
        res.status(403)
    }
}