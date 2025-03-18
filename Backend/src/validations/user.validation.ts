import { body } from "express-validator";

export const updateProfileValidation = [
    body("first_name")
        .optional()
        .isLength({ min: 5 }).withMessage("first_name must be at least 5 characters"),

    body("username")
        .optional()
        .isAlphanumeric().withMessage("username must contain only letters and numbers"),

    body("email")
        .optional()
        .isEmail().withMessage("Invalid Email. Please enter a valid email"),


    body("phone_number")
        .optional()
        .isLength({ min: 10, max: 10 }).withMessage("INVALID phone_number! Please enter a valid 10-digit phone_number.")
        .isNumeric().withMessage("phone_number must contain only numbers"),

]

