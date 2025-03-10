import { Request, Response, NextFunction } from "express"
import { ApiResponse } from "../utils/ApiResponse"

export const authorizeRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            ApiResponse(res, 401, false, "Unauthorized User");
            return;
        }
        next();
    };
};
