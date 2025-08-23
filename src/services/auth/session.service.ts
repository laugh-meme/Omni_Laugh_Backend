import type { Request } from "express"
import { consoleErrorIfDevMode, consoleIfDevMode } from "../../utils/consoleLogging.utils.ts";
import chalk from "chalk";
import { randomString } from "../../utils/createRandom.utils.ts";

export const createSessionService = (req: Request, address: `0x${string}`) => {
    try {   
        req.session.address = address
        consoleIfDevMode(`Session successfully created : ${chalk.green.bold(address)}`) 
    } catch (err: unknown) {
        throw err;
    }
}

export const revokeSessionService = (req: Request) => {
    try {

    } catch (err: unknown) {
        
    }
}

export const checkSessionAvailabilityService = (req: Request): boolean => {
    try {
        if (req.session.address) {
            return true;
        } else {
            return false;
        }
    } catch (err: unknown) {
        throw err;
    }
}

export const nonceService = (req: Request): string => {
    try {
        const nonce = randomString(30);
        consoleIfDevMode(`Nonce : ${chalk.green.bold(nonce)}`);
        
        const expireTime = Date.now() + 5 * 60 * 1000; // Expires after 5 minutes
        req.session.nonce = {
            value: nonce,
            expiresAt: expireTime
        };

        return nonce;
    } catch (err: unknown) {
        throw err;
    }
}