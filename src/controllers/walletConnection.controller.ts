import type { Request, Response, NextFunction } from "express";
import type { ConnectionID, WalletConnections } from "../models/walletConnections.model.ts";

import { fetchWalletConnectionsService, putWalletConnectionsService } from "../services/database/walletConnections.service.ts";
import { validateData } from "../utils/validateData.utils.ts";
import { validateWalletAddress } from "../utils/validateWalletAddress.ts";
import AppError from "../errors/AppError.error.ts";
import config from "../configs/config.ts";

export const fetchWalletConnectionsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { mainWalletAddress, connectionID } = req.query;
        validateWalletAddress(mainWalletAddress as string)
        
        const data = await fetchWalletConnectionsService((mainWalletAddress as `0x${string}`), connectionID as ConnectionID);
        res.status(200).json(data);
    } catch (err: unknown) {
        next(err);
    }
}

export const fetchAllWalletConnectionsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await fetchWalletConnectionsService('0xcEdCA7ae1C55E249a087e481317a041E7db27915');
        console.log(data);

        res.status(200).json(data);
    } catch (err: unknown) {
        next(err);
    }
}

export const putWalletConnectionController = async (req: Request, res: Response, next: NextFunction) => {
    if (config.nodeEnv == 'production') {
        res.redirect('/');
    }

    try {
        const { address, connectionID } = req.body;
        validateData({connectionID})
        const isAddressValid = validateWalletAddress(address as string)
        if (isAddressValid) {
            const response = await putWalletConnectionsService(address as `0x${string}`, connectionID as ConnectionID);
            res.status(200).json(response);
        } else {
            throw new AppError('Address is not valid. Please enter a valid address', 400, 'BAD_REQUEST');
        }
        
    } catch (err: unknown) {
        next(err)
    }

}