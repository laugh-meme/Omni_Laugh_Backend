import type { Request, Response, NextFunction } from 'express';

import { Client, auth } from "twitter-api-sdk";
import { randomString } from '../utils/createRandom.utils.ts';
import { X_CONFIG } from "../configs/x.config.ts";
import { consoleErrorIfDevMode, consoleIfDevMode } from '../utils/consoleLogging.utils.ts';
import chalk from 'chalk';
import { putWalletConnectionsService } from '../services/database/walletConnections.service.ts';
import type { ConnectionID } from '../models/walletConnections.model.ts';
import AppError from '../errors/AppError.error.ts';

const authClient = new auth.OAuth2User({
	client_id: X_CONFIG.client_id,
	client_secret: X_CONFIG.client_secret,
	callback: "http://localhost:5174/auth_x/callback",
	scopes: [
		"offline.access",
		"tweet.read",
		"users.read", 
		// "block.read", 
		// "block.write", 
		// "bookmark.read",
		// "bookmark.write",
		// "follows.read",
		// "follows.write",
		// "like.read",
		// "like.write",
		// "list.read",
		// "list.write",
		// "mute.read",
		// "mute.write",
		// "space.read",
		// "tweet.moderate.write",
		// "tweet.write"
	],
});

let STATE: string;
const createState = () => {
    STATE = randomString(250);
}

export const xCallbackController = async (req: Request, res: Response, next: NextFunction) => {
    try {
		const { code, state } = req.query;

		if (state !== STATE) {
			throw new AppError("State isn't matching", 401, 'UNAUTHORIZED');
		}
		
		const { token } = await authClient.requestAccessToken(code as string);

		const client = new Client(token.access_token as string);
		const user = await client.users.findMyUser();

		if (user.data?.id !== undefined) {
			req.session.xId = user.data.id;
			consoleIfDevMode(`X id stored to session : ${chalk.green.bold(req.session.xId)}`)
			req.session.address = '0xb04E18d05fc22717Cd4BBF9cb82E35dC26Da6e57';

			if (req.session.address) {
				const address: `0x${string}` = req.session.address;
				const connectionID: ConnectionID = `SOCIAL#X#${req.session.xId}`;
				
				const response = await putWalletConnectionsService(address, connectionID);
				console.log(response);
			}
		}

		res.redirect("/");
	} catch (err) {
		consoleErrorIfDevMode(err);
		next(err);
	}
} 

export const xLoginController = (req: Request, res: Response, next: NextFunction) => {
    createState();

    const authUrl = authClient.generateAuthURL({
		state: STATE,
		code_challenge_method: "s256",
    });
    res.redirect(authUrl);
}

export const xRevokeControlller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await authClient.revokeAccessToken();
        res.send(response);
    } catch (err) {
        next(err);
    }
}