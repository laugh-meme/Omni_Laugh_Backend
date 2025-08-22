// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { fileURLToPath } from "node:url";
import { AWS_CLIENT } from "../configs/aws.config.ts";

// snippet-start:[dynamodb.JavaScript.table.scanV3]
import { ScanCommand } from "@aws-sdk/client-dynamodb";

export const main = async () => {
    const command = new ScanCommand({
       TableName: 'test',
    });

    const response = await AWS_CLIENT.send(command);
    console.log(response.Items?.map(i => {
        console.log(i.Age)
    }));
};
// snippet-end:[dynamodb.JavaScript.table.scanV3]

// Invoke main function if this file was run directly.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main();
}