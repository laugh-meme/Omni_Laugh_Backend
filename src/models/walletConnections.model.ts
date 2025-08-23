import AppError from "../errors/AppError.error.ts";
import { validateWalletAddress } from "../utils/validateWalletAddress.ts";

export type ConnectionID =
	| `MAIN` | `SUB` | `SOCIAL`
	| `MAIN#0x${string}` 
	| `SUB#0x${string}` 
	| `SOCIAL#X` | `SOCIAL#X#${string}`;

export type WalletConnections = {
    MainWalletAddress: `0x${string}`;
    ConnectionID: ConnectionID;
    CreatedAt: string;
    // GSI_ConnectionLookupKey: string;
    // GSI_MainWalletAddress: `0x${string}`;
}

/**
 * Configuration for the WalletConnections DynamoDB table.
 * Defines the key schema and business rules for ConnectionID formats.
 */
export const WALLET_CONNECTIONS_TABLE = {
  name: 'WalletConnections', // Name of the DynamoDB table

  partitionKey: {
    name: 'MainWalletAddress' // Partition key: user's main wallet address (0x...)
  },

  sortKey: {
    name: 'ConnectionID', // Sort key: determines connection type and identity

    indicators: [
      // MAIN#0x... : user's primary wallet
      // Exactly 2 parts, must be a valid address, only 1 allowed
      { prefix: 'MAIN', shouldDividedInto: 2, isAddress: true, indicatorLimit: 1 },

      // SUB#0x... : secondary wallet
      // Exactly 2 parts, must be a valid address, up to 2 allowed
      { prefix: 'SUB', shouldDividedInto: 2, isAddress: true, indicatorLimit: 2 },

      // SOCIAL#X#{id} : social connection (e.g., X/Twitter)
      // Exactly 3 parts, no address, up to 2 allowed, only platform 'X' supported
      { prefix: 'SOCIAL', shouldDividedInto: 3, isAddress: false, indicatorLimit: 2, platforms: ['X'] }
    ]
  },

  attributes: {
    createdAt: 'CreatedAt' // Creation date
  }
};

export const checkWalletConnectionsTableRules = (connectionID: ConnectionID) => {
	try {
		const parsedConnectionID = connectionID.split("#").filter(d => d != '');
	
		const indicator = WALLET_CONNECTIONS_TABLE.sortKey.indicators.find(i => i.prefix == parsedConnectionID[0]);
		if (!indicator || indicator.shouldDividedInto != parsedConnectionID.length) throw new AppError('ConnectionID is invalid. Please enter a true connectionID.', 400, 'BAD_REQUEST');
		if (indicator.platforms && !indicator.platforms?.includes(parsedConnectionID[1] as string)) throw new AppError('Platform is invalid. Please enter a correct platform.', 400, 'BAD_REQUEST'); 
		if (indicator.isAddress) validateWalletAddress(parsedConnectionID.at(-1) as string);
	} catch (err: unknown) {
		throw err;
	}
}