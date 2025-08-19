import type { Request, Response, NextFunction } from 'express';

import chalk from 'chalk';
import {verifyMessage} from 'viem';
import { consoleErrorIfDevMode, consoleIfDevMode } from '../utils/consoleLogging.ts';
import { chain_config } from '../configs/config.ts';

export const verifyMessageSignature = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { address, signature } = req.body;
        consoleIfDevMode(`Address : ${chalk.green.bold(address)}`);
        consoleIfDevMode(`Signature : ${chalk.green.bold(signature)}`);
    
        const message = chain_config.signature_message;
        const verified = await verifyMessage({address, message, signature});
        consoleIfDevMode(`Is verified : ${verified ? chalk.green.bold(verified) : chalk.red.bold(verified) }`);

        if (!verified) return res.status(401).json({ error: "Invalid signature" });
        next();
    } catch (err: unknown) {
        consoleIfDevMode(`An error occurred while verifying message : `);
        consoleErrorIfDevMode(`${chalk.red.bold(err)}`);
        return res.status(500).json({ error: "Internal server error" });
    }
}