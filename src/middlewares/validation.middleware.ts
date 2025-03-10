import { Request, Response, NextFunction } from 'express';
import { validationResult } from "express-validator"


export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const validationError = {
            status: 400,
            success: false,
            errors: errors.array()
        }
        return next(validationError)
    }
    next()
}