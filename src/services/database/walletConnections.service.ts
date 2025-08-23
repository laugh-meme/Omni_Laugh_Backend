
import { PutItemCommand, QueryCommand, ScanCommand, type PutItemCommandInput, type QueryCommandInput, type ScanCommandInput, } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import { AWS_CLIENT } from "../../configs/aws.config.ts";
import type { WalletConnections, ConnectionID } from "../../models/walletConnections.model.ts";
import AppError from "../../errors/AppError.error.ts";
import { consoleIfDevMode } from "../../utils/consoleLogging.utils.ts";
import chalk from "chalk";

export const fetchWalletConnectionsService = async (mainWalletAddress: `0x${string}`, connectionID?: ConnectionID | undefined) => {
    try {

        // consoleIfDevMode(`MainWalletAddress : ${chalk.green.bold(mainWalletAddress)}`);
        // consoleIfDevMode(`ConnectionID : ${chalk.green.bold(connectionID)}`);

        let params: QueryCommandInput;

        if (connectionID == undefined) {
            params = {
                TableName: 'WalletConnections',
                KeyConditionExpression: 'MainWalletAddress = :pk',
                ExpressionAttributeValues: {
                    ':pk': { S: mainWalletAddress},
                },
            }
        } else {
            params = {
                TableName: 'WalletConnections',
                KeyConditionExpression: 'MainWalletAddress = :pk AND begins_with(ConnectionID, :sk)',
                ExpressionAttributeValues: {
                    ':pk': { S: mainWalletAddress},
                    ':sk': { S: connectionID}
                },
            }
        }

        const command = new QueryCommand(params);
        const response = await AWS_CLIENT.send(command);

        return response.Items?.map(item => unmarshall(item)) || [];
    } catch (err: unknown) {
        throw err;
    }
}

export const fetchAllWalletConnectionsService = async () => {
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

export const putWalletConnectionsService = async (mainWalletAddress: `0x${string}`, connectionID: ConnectionID) => {
    try {
        const parsedConnectionID = connectionID.split("#").filter(d => d != '');

        if ((parsedConnectionID[0] == 'MAIN' || parsedConnectionID[0] == 'SUB') && parsedConnectionID.length != 2) {
            throw new AppError('Invalid connection ID', 400, 'BAD_REQUEST');
        } else if (parsedConnectionID[0] == 'SOCIAL' && parsedConnectionID.length != 3) {
            throw new AppError('Invalid connection ID', 400, 'BAD_REQUEST');
        }

        const jointConnectionIDToFetch = parsedConnectionID.slice(0, parsedConnectionID[0] == 'MAIN' || parsedConnectionID[0] == 'SUB' ? 1 : 2).join("#");
        console.log(jointConnectionIDToFetch)

        const data = await fetchWalletConnectionsService(mainWalletAddress, jointConnectionIDToFetch as ConnectionID);
        console.log(data)
        // if (data.length >= 2) throw new AppError('User cannot have more than 2 accounts', 401, 'RESTRICTED');


        const jointConnectionIDToPut = parsedConnectionID.join('#');
        console.log(jointConnectionIDToPut);

        const item: WalletConnections = {
            MainWalletAddress: mainWalletAddress,
            ConnectionID: connectionID,
            CreatedAt: new Date().toISOString(),
            // GSI_ConnectionLookupKey: connectionID,
            // GSI_MainWalletAddress: mainWalletAddress,
        } 

        const input: PutItemCommandInput = {
            TableName: "WalletConnections",
            Item: marshall(item),
        };
        
        const command = new PutItemCommand(input);
        // const response = await AWS_CLIENT.send(command);
        // return response
    } catch (err) {
        throw err;
    }
}

export const UpdateWalletConnectionsService = () => {

}

export const DeleteWalletConnectionsService = () => {

}
