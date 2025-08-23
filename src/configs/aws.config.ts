
import { requireEnv } from '../utils/requireEnv.utils.ts';
import dotenv from 'dotenv';
dotenv.config(); 

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const AWS_CONFIG = {
    
}

export const AWS_CLIENT = new DynamoDBClient({region: 'eu-north-1', credentials: {
    accessKeyId: requireEnv('AWS_ACCESS_KEY'),
    secretAccessKey: requireEnv('AWS_SECRET_ACCESS_KEY'),
}});