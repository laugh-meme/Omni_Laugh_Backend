import type { Request, Response, NextFunction } from "express";
import { fetchWalletConnectionsService } from "../services/database/walletConnections.service.ts";
import type { WalletConnections } from "../models/walletConnections.model.ts";

export const fetchWalletConnectionsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await fetchWalletConnectionsService('0xcEdCA7ae1C55E249a087e481317a041E7db27915');
        console.log(data);

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