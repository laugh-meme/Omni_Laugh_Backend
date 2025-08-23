import { zeroAddress } from 'viem';
import { requireEnv } from '../utils/requireEnv.utils.ts';
import dotenv from 'dotenv';
dotenv.config(); 

export type ChainConfig = {
	private_key: `0x${string}`;
	signature_message: string;
}

// Blockchain related variables
export const CHAIN_CONFIG: ChainConfig = {
	private_key: (process.env.WALLET_PRIVATE_KEY as `0x${string}`) || zeroAddress,
	signature_message: requireEnv('SIGNATURE_MESSAGE')
}