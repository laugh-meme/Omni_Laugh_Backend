
import chalk from 'chalk';
import {verifyMessage, type VerifyMessageParameters} from 'viem';
import { consoleErrorIfDevMode, consoleIfDevMode } from '../../utils/consoleLogging.ts';

export const verifyMessageSignature = async ({address, message, signature}: VerifyMessageParameters, nonce: string) => {
    try {
        consoleIfDevMode(`Address : ${chalk.green.bold(address)}`);
        consoleIfDevMode(`Message : ${chalk.green.bold(message)}`);
        consoleIfDevMode(`Signature : ${chalk.green.bold(signature)}`);
        consoleIfDevMode(`Nonce : ${chalk.green.bold(nonce)}`);
    
        const verified = await verifyMessage({address, message, signature});
        consoleIfDevMode(`Is verified : ${verified ? chalk.green.bold(verified) : chalk.red.bold(verified) }`);

        return verified;
    } catch (err: unknown) {
        consoleIfDevMode(`An error occurred while verifying message : `);
        consoleErrorIfDevMode(`${chalk.red.bold(err)}`);
        throw err;
    }
}