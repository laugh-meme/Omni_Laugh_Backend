import AppError from "../errors/AppError.error.ts";

/**
 * Takes an object and checks data validity.
 * @param data 
 */
export const validateData = (data: object): void => {
    const missing: string[] = [];

    Object.entries(data).forEach(([key, value]) => {
        if (value == null || value == undefined || value === '') {
            missing.push(key);
        }
        else if (typeof value === 'string' && value.trim() === '') {
            missing.push(key);
        }
    });

    if (missing.length > 0) {
        throw new AppError(
            `Missing or empty required fields: ${missing.join(', ')}`,
            400,
            'BAD_REQUEST'
        );
    }
};