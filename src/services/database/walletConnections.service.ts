
import { PutItemCommand, QueryCommand, ScanCommand, type PutItemCommandInput, type QueryCommandInput, type ScanCommandInput, } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import { AWS_CLIENT } from "../../configs/aws.config.ts";
import type { WalletConnections } from "../../models/walletConnections.model.ts";


export const fetchWalletConnectionsService = async (mainWalletAddress: `0x${string}`, whichConnection?: string | undefined) => {
    try {
        let params: QueryCommandInput;

        if (whichConnection === undefined) {
            params = {
                TableName: 'WalletConnections',
                ExpressionAttributeValues: {
                    ':pk': { S: mainWalletAddress},
                },
                KeyConditionExpression: 'MainWalletAddress = :pk'
            }
        } else {
            params = {
                TableName: 'WalletConnections',
                ExpressionAttributeValues: {
                    ':pk': { S: mainWalletAddress},
                    ':sk': { S: whichConnection}
                },
                KeyConditionExpression: 'MainWalletAddress = :pk'
            }
        }
        
        const command = new QueryCommand(params);
        const response = await AWS_CLIENT.send(command);

        return response.Items?.map(item => unmarshall(item)) || [];
    } catch (err: unknown) {
        throw err;
    }
}

export const fetchAllWalletConnectionsService = async (mainWalletAddress: `0x${string}`, whichConnection?: string | undefined) => {
    try {
        const params: ScanCommandInput = {
            TableName: 'WalletConnections'
        }
        
        const command = new ScanCommand(params);
        const response = await AWS_CLIENT.send(command);

        return response.Items?.map(item => unmarshall(item)) || [];
    } catch (err: unknown) {
        throw err;
    }
}

/** */
export const putWalletConnectionsService = async (mainWalletAddress: `0x${string}`, connectionID: string) => {
    try {
        const item: WalletConnections = {
            MainWalletAddress: mainWalletAddress,
            ConnectionID: connectionID,
            createdAt: new Date().toISOString,
            // GSI_ConnectionLookupKey: connectionID,
            // GSI_MainWalletAddress: mainWalletAddress,
        } 
    
        const input: PutItemCommandInput = {
            TableName: "WalletConnections",
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
