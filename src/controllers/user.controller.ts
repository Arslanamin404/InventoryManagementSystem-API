import { Request, Response, NextFunction } from "express"
import { ApiResponse } from "../utils/ApiResponse";
import { AuthServices } from "../services/auth.services";
import { OtpUtils } from "../utils/OtpUtils";
import { config } from "../config/env";
import { sendEmail } from "../utils/sendEmail";

export class UserControllers {
    static async profile(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user;
            if (!user) {
                return ApiResponse(res, 400, false, "User not found")
            }
            return ApiResponse(res, 200, true, "Profile fetched successfully", undefined, user)
        } catch (error) {
            next(error)
        }
    }

    static async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user;
            if (!user) {
                return ApiResponse(res, 400, false, "User not found")
            }
            const { first_name, last_name, username, phone_number } = req.body;

            if (first_name) {
                user.first_name = first_name
            }

            if (last_name) {
                user.last_name = last_name
            }

            if (username) {
                user.username = username
            }

            if (phone_number) {
                user.phone_number = phone_number
            }

            await user.save()
            return ApiResponse(res, 200, true, "Profile updates successfully", undefined, user)
        } catch (error) {
            next(error)
        }
    }

    static async getEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user;
            if (!user) {
                return ApiResponse(res, 400, false, "User not found")
            }

            return ApiResponse(res, 200, true, "User email fetched successfully", undefined, {
                email: user.email
            })
        } catch (error) {
            next(error)
        }
    }

    static async requestEmailChange(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user;
            if (!user) {
                return ApiResponse(res, 400, false, "User not found")
            }

            const { newEmail } = req.body;
            if (!newEmail) return ApiResponse(res, 400, false, "New email is required");

            const existingUser = await AuthServices.findUserByEmail(newEmail);
            if (existingUser)
                return ApiResponse(res, 400, false, "Email already in use")

            const otp = OtpUtils.generateOTP();
            const otpExpiresIn = new Date(Date.now() + config.OTP_EXPIRES_IN)
            const hashed_otp = await OtpUtils.hashOTP(otp, next);

            user.otp = hashed_otp;
            user.otpExpiresAt = otpExpiresIn
            await user.save()

            await sendEmail(newEmail, "Confirm Your New Email Address", undefined,
                `
                <p>Your OTP for changing your email is:</p>
                <h2>${otp}</h2>
                <p>Valid for 5 minutes.</p>
                `
            );

            return ApiResponse(res, 200, true, "OTP sent to your new email. Please verify.");
        } catch (error) {
            next(error)
        }
    }

    static async verifyEmailChangeOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user;
            if (!user) {
                return ApiResponse(res, 400, false, "User not found")
            }

            const { new_email, otp } = req.body;

            if (!new_email || !otp)
                return ApiResponse(res, 400, false, "OTP and new_email are required");

            const isValid = await OtpUtils.verifyOtp(otp, user.otp!, next);
            if (!isValid)
                return ApiResponse(res, 400, false, "Invalid or expired OTP");

            user.email = new_email
            user.otp = undefined
            user.otpExpiresAt = undefined

            await user.save()
            return ApiResponse(res, 200, true, "Email updated successfully.");
        } catch (error) {
            next(error)
        }
    }

    static async fetchAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await AuthServices.getAllUsers();

            return ApiResponse(res, 200, true, "Users fetched successfully.", undefined, { users });
        } catch (error) {
            next(error)
        }
    }

    static async fetchUserById(req: Request, res: Response, next: NextFunction) {
        try {

            const { id } = req.params

            const user = await AuthServices.findUserByID(id);
            if (!user)
                return ApiResponse(res, 400, false, "Invalid ID, user with this id not found")

            return ApiResponse(res, 200, true, "User fetched successfully.", undefined, { user });
        } catch (error) {
            next(error)
        }
    }

    static async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params

            const user = await AuthServices.findUserByID(id);
            if (!user)
                return ApiResponse(res, 400, false, "Invalid ID, user with this id not found")

            const { first_name,
                last_name,
                username,
                email,
                phone_number,
                role } = req.body

            if (first_name)
                user.first_name = first_name

            if (last_name)
                user.last_name = last_name

            if (username)
                user.username = username

            if (email)
                user.email = email

            if (phone_number)
                user.phone_number = phone_number

            if (role)
                user.role = role

            await user.save()


            return ApiResponse(res, 200, true, "Users profile updated successfully.", undefined, { user });
        } catch (error) {
            next(error)
        }
    }

    static async updateUserRole(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params

            const user = await AuthServices.findUserByID(id);
            if (!user)
                return ApiResponse(res, 400, false, "Invalid ID, user with this id not found")

            const { role } = req.body
            if (!role)
                return ApiResponse(res, 400, false, "Invalid request. Role is required.");

            if (role.toUpperCase() !== "ADMIN" || role.toUpperCase() != "STAFF")
                return ApiResponse(res, 400, false, "Invalid user role, please enter either ADMIN or STAFF as role")

            user.role = role
            await user.save()

            return ApiResponse(res, 200, true, "Users role updated successfully.", undefined, { new_role: user.role });
        } catch (error) {
            next(error)
        }
    }

    static async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            if (!id)
                return ApiResponse(res, 400, false, "user id is required")

            const deletedUser = await AuthServices.deleteUserByID(id);

            if (!deletedUser)
                return ApiResponse(res, 400, false, "User not found. Deletion failed!")

            return ApiResponse(res, 200, true, "User deleted successfully.");
        } catch (error) {
            next(error)
        }
    }
}