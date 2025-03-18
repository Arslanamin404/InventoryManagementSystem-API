import { Request, Response, NextFunction, Router } from "express";
import { UserControllers } from "../controllers/user.controller";
import { validate } from "../middlewares/validation.middleware";
import { updateProfileValidation } from "../validations/user.validation";
import { authorizeRole } from "../middlewares/authorizeRole.middleware";

const userRouter = Router()

userRouter.get("/profile", (req: Request, res: Response, next: NextFunction) => {
    UserControllers.profile(req, res, next);
})

userRouter.put("/update-profile", updateProfileValidation, validate, (req: Request, res: Response, next: NextFunction) => {
    UserControllers.updateProfile(req, res, next);
})

userRouter.get("/email", (req: Request, res: Response, next: NextFunction) => {
    UserControllers.getEmail(req, res, next);
})

userRouter.post("/change-email", (req: Request, res: Response, next: NextFunction) => {
    UserControllers.requestEmailChange(req, res, next);
})

userRouter.post("/verify-change-email-otp", (req: Request, res: Response, next: NextFunction) => {
    UserControllers.verifyEmailChangeOtp(req, res, next);
})

userRouter.get("/", authorizeRole(["admin", "ADMIN"]), (req: Request, res: Response, next: NextFunction) => {
    UserControllers.fetchAllUsers(req, res, next);
})

userRouter.get("/:id", authorizeRole(["admin", "ADMIN"]), (req: Request, res: Response, next: NextFunction) => {
    UserControllers.fetchUserById(req, res, next);
})

userRouter.put("/:id", authorizeRole(["admin", "ADMIN"]), (req: Request, res: Response, next: NextFunction) => {
    UserControllers.updateUser(req, res, next);
})

userRouter.put("/update-role/:id", authorizeRole(["admin", "ADMIN"]), (req: Request, res: Response, next: NextFunction) => {
    UserControllers.updateUserRole(req, res, next);
})

userRouter.delete("/:id", authorizeRole(["admin", "ADMIN"]), (req: Request, res: Response, next: NextFunction) => {
    UserControllers.deleteUser(req, res, next);
})

export default userRouter