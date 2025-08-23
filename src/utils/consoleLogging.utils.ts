import config from '../configs/config.ts';

export const consoleIfDevMode = (msg: any) => {
        const nodeEnv = config.nodeEnv;
        if (nodeEnv == 'development') console.log(msg);
}

export const consoleErrorIfDevMode = (err: unknown) => {
        const nodeEnv = config.nodeEnv;
        if (nodeEnv == 'development') {
            if (err instanceof Error) console.log(err.message);
            console.log(err);
        }
}