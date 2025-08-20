import type { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError.error.ts";


export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let code = "SERVER_ERROR";
    let message = "An unexpected error occurred";
    let stack: string | undefined;

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        code = err.code;
        message = err.message;
        stack = err.stack;
    } else if (err instanceof Error) {
        message = err.message;
        stack = err.stack;
    } else {
        message = String(err);
    }

    if (process.env.NODE_ENV === "development" && stack) {
        console.error(stack);
    } else if (process.env.NODE_ENV === "development") {
        console.error(message);
    }

    res.status(statusCode).json({
        message,
        code,
        ...(process.env.NODE_ENV === "development" ? { stack } : {})
    });
};
