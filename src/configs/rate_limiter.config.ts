import type {Options} from "express-rate-limit";
import AppError from "../errors/AppError.error.ts";

export const RATE_LIMITER_CONFIG: Partial<Options> = {
    windowMs: 15 * 60 * 1000, 
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    ipv6Subnet: 56,
    handler: () => {
        throw new AppError('The limit has been exceeded. Please try again later...',  429, 'MANY_REQUEST');
    }
};

