import e, { Request, Response, NextFunction } from "express"
import { IUser } from "../interfaces/IUser";
import { ApiResponse } from "../utils/ApiResponse";
import { JwtUtils } from "../utils/jwt.utils";
import { config } from "../config/env";
import { AuthServices } from "../services/auth.services";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies?.access_token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            ApiResponse(res, 401, false, "Unauthorized: Token is missing!");
            return
        }

        const decode = JwtUtils.verifyToken(token, config.ACCESS_TOKEN_SECRET);

        if (!decode) {
            ApiResponse(res, 401, false, "Unauthorized: Invalid or expired Access Token");
            return
        }

        const user = await AuthServices.findUserByID(decode?.id)

        if (!user) {
            ApiResponse(res, 401, false, "Unauthorized: User not found");
            return
        }

        req.user = user;
        next()
    } catch (error) {
        console.log("Authentication Error: ", error);
        next(error)
    }
}