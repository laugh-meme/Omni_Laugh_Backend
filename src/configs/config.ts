import dotenv from 'dotenv';

dotenv.config();

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