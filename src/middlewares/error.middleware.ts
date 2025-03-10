import { Request, Response, NextFunction } from "express"

interface CustomError extends Error {
    statusCode?: number;
    message: string;
    errors?: any[];
}

export const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error(err);
    
    const errStatusCode = err.statusCode || 500;
    const errMsg = err.message || "Something went wrong";

    res.status(errStatusCode).json({
        success: false,
        message: errMsg,
        errors: err.errors || []
    });
};
