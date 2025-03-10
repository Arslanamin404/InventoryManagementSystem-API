import e, { Request, Response, NextFunction, Router } from "express";
import { AuthControllers } from "../controllers/auth.controller";
import { validate } from "../middlewares/validation.middleware";
import { loginValidation, registerValidation, verifyOTPValidation } from "../validations/auth.validation";
import { ApiResponse } from "../utils/ApiResponse";

const statusRouter = Router()

statusRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
    try {
        ApiResponse(res, 200, true, "API is running...")
    } catch (error) {
        next(error)
    }
})

export default statusRouter