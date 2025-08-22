import dotenv from 'dotenv';

dotenv.config();

// Server variables
type Config = {
	port: number;
	chainEnv: 'mainnet' | 'testnet';
	nodeEnv: 'production' | 'development';
}

const config: Config = {
	port: Number(process.env.PORT) || 3000,
	chainEnv: (process.env.CHAIN_ENV as 'mainnet' | 'testnet') || 'testnet',
	nodeEnv: (process.env.NODE_ENV as 'production' | 'development') || 'development',
}

export default config;