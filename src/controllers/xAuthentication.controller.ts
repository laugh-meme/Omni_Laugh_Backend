import type { Request, Response, NextFunction } from 'express';

import { Client, auth } from "twitter-api-sdk";
import { randomString } from '../utils/createRandom.utils.ts';
import { x_config } from "../configs/config.ts";



const authClient = new auth.OAuth2User({
	client_id: x_config.client_id,
	client_secret: x_config.client_secret,
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

export const xCallback = async (req: Request, res: Response) => {
    try {
		const { code, state } = req.query;

		if (state !== STATE) {
			res.status(400).send("State isn't matching");
		}
		5
		const { token } = await authClient.requestAccessToken(code as string);

		const client = new Client(token.access_token as string);
		const user = await client.users.findMyUser();

		console.log(user);
		res.redirect("/");
	} catch (error) {
		console.log(error);
	}
} 

export const xLogin = (req: Request, res: Response) => {
    createState();

    const authUrl = authClient.generateAuthURL({
		state: STATE,
		code_challenge_method: "s256",
    });
    res.redirect(authUrl);
}

export const xRevoke = async (req: Request, res: Response) => {
    try {
        const response = await authClient.revokeAccessToken();
        res.send(response);
    } catch (error) {
        console.log(error);
    }
}