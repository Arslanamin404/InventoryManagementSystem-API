import bcrypt from 'bcrypt';
import { NextFunction } from 'express';


export class OtpUtils {
    static generateOTP = () => {
        const digits = "0123456789"
        let otp = ""

        for (let i = 0; i < 6; i++) {
            otp += digits[Math.floor(Math.random() * digits.length)];
        }
        return otp;
    }

    static hashOTP = async (otp: string, next: NextFunction) => {
        try {
            return await bcrypt.hash(otp, 10)
        } catch (error) {
            next(error)
        }
    }

    static verifyOtp = async (incomingOTP: string, hashedOTP: string, next: NextFunction): Promise<Boolean | void> => {
        try {
            return await bcrypt.compare(incomingOTP, hashedOTP)
        } catch (error) {
            next(error)
        }
    }
}