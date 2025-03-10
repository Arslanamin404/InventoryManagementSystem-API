import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { config } from "../config/env";
import { ITokenPayload } from "../interfaces/ITokenPayload";


export class JwtUtils {
    private static generateToken(
        payload: ITokenPayload,
        secret: string,
        expiresIn: string | number
    ): string {
        const options: SignOptions = {
            expiresIn: expiresIn as SignOptions["expiresIn"] // Explicitly cast to match expected type
        };
        return jwt.sign(payload, secret, options);
    }

    static generateTokens(user: ITokenPayload): {
        accessToken: string;
        refreshToken: string;
    } {
        const accessToken = JwtUtils.generateToken(
            { id: user.id.toString(), email: user.email, role: user.role },
            config.ACCESS_TOKEN_SECRET,
            config.ACCESS_TOKEN_EXPIRES_IN
        );

        const refreshToken = JwtUtils.generateToken(
            { id: user.id, email: user.email, role: user.role },
            config.REFRESH_TOKEN_SECRET,
            config.REFRESH_TOKEN_EXPIRES_IN
        );

        return { accessToken, refreshToken };
    }

    static verifyToken(token: string, secret: string): JwtPayload | null {
        try {
            return jwt.verify(token, secret) as JwtPayload;
        } catch (error) {
            console.error("JWT verification failed:", error);
            return null;
        }
    }
}
