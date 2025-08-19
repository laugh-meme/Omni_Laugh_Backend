import dotenv from 'dotenv';
import { zeroAddress } from 'viem';

dotenv.config();

function requireEnv(key: string | `0x${string}`): string | `0x${string}`{
	const value = process.env[key];
	if (!value) throw new Error(`Missing environment variable: ${key}`);
	return value;
}

type ChainConfig = {
	private_key: `0x${string}`;
	signature_message: string;
}

// Blockchain related variables
export const chain_config: ChainConfig = {
	private_key: (process.env.WALLET_PRIVATE_KEY as `0x${string}`) || zeroAddress,
	signature_message: requireEnv('SIGNATURE_MESSAGE')
}

type X_Config = {
	api_key: string;
	api_secret: string;
	bearer_token: string;
	client_id: string;
	client_secret: string;
}

// X API variables
export const x_config: X_Config = {
	api_key: requireEnv('X_API_KEY'),
	api_secret: requireEnv('X_API_SECRET'),
	bearer_token: requireEnv('X_BEARER_TOKEN'),
	client_id: requireEnv('X_CLIENT_ID'),
	client_secret: requireEnv('X_CLIENT_SECRET'),
}

// Server variables
type Config = {
	port: number;
	nodeEnv: 'production' | 'development';
}

const config: Config = {
	port: Number(process.env.PORT) || 3000,
	nodeEnv: (process.env.NODE_ENV as 'production' | 'development') || 'development',
}

export default config;