import { Request, Response, NextFunction, Router } from "express";
import { AuthControllers } from "../controllers/auth.controller";
import { validate } from "../middlewares/validation.middleware";
import {
    loginValidation,
    registerValidation,
    resendOTPValidation,
    verifyOTPValidation
} from "../validations/auth.validation";

const authRouter = Router()

authRouter.post("/register", registerValidation, validate, (req: Request, res: Response, next: NextFunction) => {
    AuthControllers.register(req, res, next);
})

authRouter.post("/verify-otp", verifyOTPValidation, validate, (req: Request, res: Response, next: NextFunction) => {
    AuthControllers.verifyOTP(req, res, next);
})
authRouter.post("/resend-otp", resendOTPValidation, validate, (req: Request, res: Response, next: NextFunction) => {
    AuthControllers.resendOTP(req, res, next);
})

authRouter.post("/login", loginValidation, validate, (req: Request, res: Response, next: NextFunction) => {
    AuthControllers.login(req, res, next);
})

authRouter.post("/logout", (req: Request, res: Response, next: NextFunction) => {
    AuthControllers.logout(req, res, next);
})

authRouter.post("/refresh-token", (req: Request, res: Response, next: NextFunction) => {
    AuthControllers.refresh_accessToken(req, res, next);
})

authRouter.post("/reset-password", (req: Request, res: Response, next: NextFunction) => {
    AuthControllers.resetPasswordRequest(req, res, next);
})

authRouter.post("/verify-reset-password-otp", (req: Request, res: Response, next: NextFunction) => {
    AuthControllers.verifyResetPasswordOtp(req, res, next);
})

export default authRouter