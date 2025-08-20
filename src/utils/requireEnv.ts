import dotenv from 'dotenv';
dotenv.config(); 

export const requireEnv = (key: string | `0x${string}`): string | `0x${string}` => {
	const value = process.env[key];
	if (!value) throw new Error(`Missing environment variable: ${key}`);
	return value;
}