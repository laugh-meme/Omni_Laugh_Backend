import { isAddress } from "viem";
import AppError from "../errors/AppError.error.ts";

export const validateWalletAddress = (address: string) => {
    try {
        const isAddressValid = isAddress(address);
        if (!isAddressValid) {
            throw new AppError('Invalid wallet address. Please check your wallet address...', 400, 'BAD_REQUEST');
        }
        return isAddressValid;
    } catch (err: unknown) {
        throw err;
    }
}