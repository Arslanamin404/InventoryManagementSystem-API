import e, { Request, Response, NextFunction } from 'express'
import { ApiResponse } from '../utils/ApiResponse';
import { AuthServices } from '../services/auth.services';
import { config } from '../config/env';
import { OtpUtils } from '../utils/OtpUtils';
import { IUser } from '../interfaces/IUser';
import { sendEmail } from '../utils/sendEmail';
import { JwtUtils } from '../utils/jwt.utils';

export class AuthControllers {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { first_name, last_name, username, email, password, phone_number } = req.body;
            const existingUser = await AuthServices.checkExistingUser(email);
            if (existingUser) {
                return ApiResponse(res, 400, false, "User already registered")
            }

            const otp = OtpUtils.generateOTP();
            const otpExpiresAt = new Date(Date.now() + (config.OTP_EXPIRES_IN));
            const hashedOTP = await OtpUtils.hashOTP(otp, next);


            const new_user: Partial<IUser> = { first_name, last_name, username, email, password, phone_number, otp: hashedOTP, otpExpiresAt }

            await AuthServices.createUser(new_user);

            await sendEmail(email, "Secure OTP for Your Account Verification", undefined,
                `
                 <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: rgb(233, 238, 248); color:rgb(13, 15, 18);">
                    <h2 style="color: #333;">Your OTP for Secure Login</h2>
                    <p>Hello <i>${first_name}</i>,</p>
                    <p>We received a request to verify your identity. Use the following OTP (One-Time Password) to proceed:</p>
                    <div style="font-size: 30px; text-align:center; font-weight: bold; color:rgb(248, 165, 11); margin: 15px auto;">${otp}</div>
                    <p>This OTP is valid for <strong style="color:rgb(244, 6, 6)">5 minutes</strong> only. Do not share it with anyone.</p>
                    <p>If you did not request this, please ignore this email or contact support.</p>
                    <br />
                    <p>Best Regards,</p>
                    <p><strong>Mohammad Arsalan Rather</strong></p>
                    <a href="https://arsalanrather.vercel.app">https://arsalanrather.vercel.app</a>
                </div>
                `
            )
            return ApiResponse(res, 201, true, "User registered successfully. OTP sent to your email, please check it and verify your account.")
        } catch (error) {
            next(error)
        }
    }

    static async verifyOTP(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, otp } = req.body
            const user = await AuthServices.findUserByEmail(email);

            if (!user) {
                return ApiResponse(res, 401, false, "Invalid Credentials!")
            }

            if (!user.otpExpiresAt || new Date(user.otpExpiresAt) < new Date()) {
                return ApiResponse(res, 400, false, "Invalid or expired OTP");
            }

            if (!user.otp) {
                return ApiResponse(res, 400, false, "Invalid or expired OTP");
            }

            const isOtpValid = await OtpUtils.verifyOtp(otp, user.otp, next);
            if (!isOtpValid) {
                return ApiResponse(res, 400, false, "Invalid or expired OTP");
            }

            user.isVerified = true;
            user.otp = undefined;
            user.otpExpiresAt = undefined;
            await user.save();

            return ApiResponse(res, 200, true, "Email verified successfully");

        } catch (error) {
            next(error)
        }
    }

    static async resendOTP(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body
            const user = await AuthServices.findUserByEmail(email);

            if (!user) {
                return ApiResponse(res, 401, false, "Invalid Credentials!")
            }

            if (user.isVerified) {
                return ApiResponse(res, 400, false, "Email already verified. You can log in.");
            }

            const otp = OtpUtils.generateOTP();
            const otpExpiresAt = new Date(Date.now() + (config.OTP_EXPIRES_IN));
            const hashedOTP = await OtpUtils.hashOTP(otp, next);

            user.otp = hashedOTP;
            user.otpExpiresAt = otpExpiresAt
            await user.save()

            await sendEmail(email, "Your OTP Has Been Resent – Verify Your Account", undefined,
                `
                 <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: rgb(233, 238, 248); color:rgb(13, 15, 18);">
                    <h2 style="color: #333;">Your OTP for Secure Login</h2>
                    <p>Hello <i>${user.first_name}</i>,</p>
                    <p>We received a request to verify your identity. Use the following OTP (One-Time Password) to proceed:</p>
                    <div style="font-size: 30px; text-align:center; font-weight: bold; color:rgb(248, 165, 11); margin: 15px auto;">${otp}</div>
                    <p>This OTP is valid for <strong style="color:rgb(244, 6, 6)">5 minutes</strong> only. Do not share it with anyone.</p>
                    <p>If you did not request this, please ignore this email or contact support.</p>
                    <br />
                    <p>Best Regards,</p>
                    <p><strong>Mohammad Arsalan Rather</strong></p>
                    <a href="https://arsalanrather.vercel.app">https://arsalanrather.vercel.app</a>
                </div>
                `
            )

            return ApiResponse(res, 200, true, "OTP resent successfully. Please check your email.");
        } catch (error) {
            next(error)
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            const user = await AuthServices.findUserByEmail(email);
            if (!user) {
                return ApiResponse(res, 401, false, "Invalid Credentials");
            }

            if (!user.isVerified) {
                return ApiResponse(res, 400, false, "Email not verified");
            }

            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return ApiResponse(res, 401, false, "Invalid Credentials");
            }

            // all credentials are valid, generate tokens

            const { accessToken, refreshToken } = JwtUtils.generateTokens({
                id: user.id,
                email,
                role: user.role
            })

            user.refreshToken = refreshToken;
            await user.save();

            res.cookie("access_token", accessToken, {
                httpOnly: true,
                secure: false, // Ensure secure flag is enabled for HTTPS environments
                sameSite: "strict", // Prevent CSRF
            })

            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                secure: false, // Ensure secure flag is enabled for HTTPS environments
                sameSite: "strict", // Prevent CSRF
            })

            return ApiResponse(res, 200, true, "Logged in successfully");

        } catch (error) {
            next(error)
        }
    }

    static async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const incomingRefreshToken = req.cookies.refresh_token || req.body.refresh_token;

            if (!incomingRefreshToken) {
                return ApiResponse(res, 400, false, "Invalid Token")
            }

            const user = await AuthServices.findUserByRefreshToken(incomingRefreshToken);

            if (!user) {
                return ApiResponse(res, 401, false, "Invalid Credentials");
            }

            user.refreshToken = undefined;
            await user.save()

            res.clearCookie("access_token", {
                httpOnly: true,
                secure: false, // Ensure secure flag is enabled for HTTPS environments
                sameSite: "strict", // Prevent CSRF
            })

            res.clearCookie("refresh_token", {
                httpOnly: true,
                secure: false, // Ensure secure flag is enabled for HTTPS environments
                sameSite: "strict", // Prevent CSRF
            })

            return ApiResponse(res, 200, true, "Logged out successfully");

        } catch (error) {
            next(error)
        }
    }

    static async refresh_accessToken(req: Request, res: Response, next: NextFunction) {
        try {
            const incomingRefreshToken = req.cookies.refresh_token || req.body.refresh_token;

            if (!incomingRefreshToken) {
                return ApiResponse(res, 400, false, "Unauthorized Request")
            }

            const decodedToken = JwtUtils.verifyToken(incomingRefreshToken, config.REFRESH_TOKEN_SECRET)

            if (!decodedToken || typeof decodedToken !== "object") {
                return ApiResponse(res, 403, false, "Invalid Token");
            }

            const user = await AuthServices.findUserByID(decodedToken.id);

            if (!user) {
                return ApiResponse(res, 403, false, "Invalid Token");
            }

            const isTokenValid = user.refreshToken === incomingRefreshToken;

            if (!isTokenValid) {
                return ApiResponse(res, 403, false, "Invalid Token");
            }

            const { accessToken, refreshToken } = JwtUtils.generateTokens({ id: user.id.toString(), email: user.email, role: user.role })

            user.refreshToken = refreshToken;
            await user.save();
            // Set new cookies
            res.cookie("access_token", accessToken, {
                httpOnly: true,
                secure: false, // Ensure secure flag is enabled for HTTPS environments
                sameSite: "strict", // Prevent CSRF

            });

            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                secure: false, // Ensure secure flag is enabled for HTTPS environments
                sameSite: "strict", // Prevent CSRF
            });

            return ApiResponse(res, 200, true, "Token refreshed successfully");

        } catch (error) {
            next(error)
        }
    }

    static async resetPasswordRequest(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;
            if (!email) {
                return ApiResponse(res, 400, false, "Email is required")
            }

            const user = await AuthServices.findUserByEmail(email);
            if (!user) {
                return ApiResponse(res, 400, false, "User not found");
            }

            const otp = OtpUtils.generateOTP();
            const otpExpiresAt = new Date(Date.now() + (config.OTP_EXPIRES_IN))
            const hashedOTP = await OtpUtils.hashOTP(otp, next);

            user.otp = hashedOTP;
            user.otpExpiresAt = otpExpiresAt
            await user.save();

            await sendEmail(email, "Reset Your Password", undefined,
                `
                <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: rgb(233, 238, 248); color:rgb(13, 15, 18);">
                    <h2 style="color: #333;">OTP for Email Change Request</h2>
                    <p>Hello <i>${user.first_name}</i>,</p>
                    <p>We received a request to <strong>reset your password</strong> associated with your account. To proceed, please use the following OTP:</p>
                    <div style="font-size: 30px; text-align:center; font-weight: bold; color:rgb(248, 165, 11); margin: 15px auto;">${otp}</div>
                    <p>This OTP is valid for <strong style="color:rgb(244, 6, 6)">5 minutes</strong>. Do not share it with anyone.</p>
                    <p>If you did not request this change, please ignore this email or contact our support team immediately.</p>
                    <br />
                    <p>Best Regards,</p>
                    <p><strong>Mohammad Arsalan Rather</strong></p>
                    <a href="https://arsalanrather.vercel.app">https://arsalanrather.vercel.app</a>
                </div>
                `
            );
            return ApiResponse(res, 200, true, "OTP sent to your email for password reset. Verify the otp to reflect changes.")

        } catch (error) {
            next(error)
        }
    }

    static async verifyResetPasswordOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, otp, new_password } = req.body;

            if (!email || !otp || !new_password)
                return ApiResponse(res, 400, false, "Email, OTP and new password are required");

            const user = await AuthServices.findUserByEmail(email);
            if (!user || !user.otp || !user.otpExpiresAt)
                return ApiResponse(res, 400, false, "Invalid Request")

            if (new Date(user.otpExpiresAt) < new Date())
                return ApiResponse(res, 400, false, "OTP expired")

            const isValidOtp = await OtpUtils.verifyOtp(otp, user.otp, next);
            if (!isValidOtp)
                return ApiResponse(res, 400, false, "Invalid OTP");

            user.password = new_password;
            user.otp = undefined;
            user.otpExpiresAt = undefined;
            await user.save()

            return ApiResponse(res, 200, true, "Password reset successfully");
        } catch (error) {
            next(error)
        }
    }
}