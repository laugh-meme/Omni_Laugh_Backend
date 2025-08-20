import dotenv from 'dotenv';
dotenv.config();
import { requireEnv } from '../utils/requireEnv.ts';

export type X_Config = {
	api_key: string;
	api_secret: string;
	bearer_token: string;
	client_id: string;
	client_secret: string;
}

// X API variables
export const X_CONFIG: X_Config = {
	api_key: requireEnv('X_API_KEY'),
	api_secret: requireEnv('X_API_SECRET'),
	bearer_token: requireEnv('X_BEARER_TOKEN'),
	client_id: requireEnv('X_CLIENT_ID'),
	client_secret: requireEnv('X_CLIENT_SECRET'),
}