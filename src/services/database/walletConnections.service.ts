
import { type WalletConnections, type ConnectionID, WALLET_CONNECTIONS_TABLE, checkWalletConnectionsTableRules } from "../../models/walletConnections.model.ts";
import { PutItemCommand, QueryCommand, ScanCommand, type PutItemCommandInput, type QueryCommandInput, type ScanCommandInput, } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import { AWS_CLIENT } from "../../configs/aws.config.ts";
import AppError from "../../errors/AppError.error.ts";
import { validateWalletAddress } from "../../utils/validateWalletAddress.ts";

const TABLE_NAME = WALLET_CONNECTIONS_TABLE.name;

/**
 * Queries wallet connections for a given main wallet address.
 * If connectionID is provided, filters by prefix (e.g., SOCIAL#X#).
 * 
 * @param mainWalletAddress - The user's main wallet address (partition key)
 * @param connectionID - Optional connection ID prefix to filter by (e.g., 'SOCIAL#X#')
 * @returns Array of unmarshalled wallet connection records
 */
export const fetchWalletConnectionsService = async (mainWalletAddress: `0x${string}`, connectionID?: ConnectionID | undefined): Promise<WalletConnections[]> =>  {
    try {
        // Base query: always filter by main wallet address
        const params: QueryCommandInput = {
        TableName: TABLE_NAME,
        KeyConditionExpression: 'MainWalletAddress = :pk',
        ExpressionAttributeValues: {
            ':pk': { S: mainWalletAddress },
        },
        };

        // If connectionID is provided, add sort key condition
        if (connectionID) {
            params.KeyConditionExpression += ' AND begins_with(ConnectionID, :sk)';
            params.ExpressionAttributeValues![':sk'] = { S: connectionID };
        }

        const command = new QueryCommand(params);
        const response = await AWS_CLIENT.send(command);

        return response.Items?.map(item => unmarshall(item) as WalletConnections) || [];
    } catch (err) {
        throw err;
    }
}

/**
 * 
 * @returns 
 */
export const fetchAllWalletConnectionsService = async () => {
    try {
        const params: ScanCommandInput = {
            TableName: TABLE_NAME
        }
        
        const command = new ScanCommand(params);
        const response = await AWS_CLIENT.send(command);

        return response.Items?.map(item => unmarshall(item)) || [];
    } catch (err: unknown) {
        throw err;
    }
}

/**
 * Stores a new wallet connection (e.g., main, sub, or social) in DynamoDB.
 * Validates the connection ID format, enforces per-wallet limits, and ensures platform rules.
 * 
 * @param mainWalletAddress - The user's main wallet address (partition key)
 * @param connectionID - The connection string (e.g., MAIN#0x..., SOCIAL#X#id) 
 * @returns PutItemCommand response from DynamoDB
 * @throws AppError if validation fails or limit is exceeded
 */
export const putWalletConnectionsService = async (mainWalletAddress: `0x${string}`, connectionID: ConnectionID) => {
    try {
        const parsedConnectionID = connectionID.split("#").filter(d => d != '');

        const indicator = WALLET_CONNECTIONS_TABLE.sortKey.indicators.find(i => i.prefix == parsedConnectionID[0]);
        if (!indicator || indicator.shouldDividedInto != parsedConnectionID.length) throw new AppError('ConnectionID is invalid. Please enter a true connectionID.', 400, 'BAD_REQUEST');
        if (indicator.platforms && !indicator.platforms?.includes(parsedConnectionID[1] as string)) throw new AppError('Platform is invalid. Please enter a correct platform.', 400, 'BAD_REQUEST'); 
        if (indicator.isAddress) validateWalletAddress(parsedConnectionID.at(-1) as string);

        const connectionIDPrefix = parsedConnectionID.slice(0, indicator.shouldDividedInto - 1).join("#");
        const data = await fetchWalletConnectionsService(mainWalletAddress, connectionIDPrefix as ConnectionID);
        if (data.length >= indicator.indicatorLimit) throw new AppError(`User cannot have more than ${indicator.indicatorLimit} ConnectionID`, 401, 'RESTRICTED');

        const fullConnectionID = parsedConnectionID.join('#');

        const item: WalletConnections = {
            MainWalletAddress: mainWalletAddress,
            ConnectionID: fullConnectionID as ConnectionID,
            CreatedAt: new Date().toISOString(),
            // GSI_ConnectionLookupKey: connectionID,
            // GSI_MainWalletAddress: mainWalletAddress,
        } 

        const input: PutItemCommandInput = {
            TableName: TABLE_NAME,
            Item: marshall(item),
        };
        
        const command = new PutItemCommand(input);
        const response = await AWS_CLIENT.send(command);
        return response
    } catch (err) {
        throw err;
    }
}

export const UpdateWalletConnectionsService = () => {

}

export const DeleteWalletConnectionsService = () => {

}
