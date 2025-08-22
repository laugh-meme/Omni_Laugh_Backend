
import { requireEnv } from '../utils/requireEnv.ts';
import dotenv from 'dotenv';
dotenv.config(); 

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const AWS_CONFIG = {
    access_key: requireEnv('AWS_ACCESS_KEY'),
    secret_access_key: requireEnv('AWS_SECRET_ACCESS_KEY')
}

export const AWS_CLIENT = new DynamoDBClient({region: 'eu-north-1', credentials: {
    accessKeyId: AWS_CONFIG.access_key,
    secretAccessKey: AWS_CONFIG.secret_access_key,
}});