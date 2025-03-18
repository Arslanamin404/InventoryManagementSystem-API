import { body } from "express-validator";

export const registerValidation = [
    body("first_name")
        .notEmpty().withMessage("first_name is required")
        .isLength({ min: 5 }).withMessage("first_name must be at least 5 characters"),

    body("username")
        .notEmpty().withMessage("username is required")
        .isAlphanumeric().withMessage("username must contain only letters and numbers"),

    body("email")
        .notEmpty().withMessage("email is required")
        .isEmail().withMessage("Invalid Email. Please enter a valid email"),

    body("password")
        .notEmpty().withMessage("password is required")
        .isLength({ min: 7 }).withMessage("password must be at least of 7 characters"),

    body("phone_number")
        .notEmpty().withMessage("Phone Number is required")
        .isLength({ min: 10, max: 10 }).withMessage("INVALID phone_number! Please enter a valid 10-digit phone_number.")
        .isNumeric().withMessage("phone_number must contain only numbers"),

    body("role")
        .optional()
        .isIn(["ADMIN", "STAFF"]).withMessage("role must be either ADMIN or STAFF"),

]

export const verifyOTPValidation = [
    body("email")
        .notEmpty().withMessage("email is required")
        .isEmail().withMessage("Invalid Email. Please enter a valid email"),

    body("otp")
        .notEmpty().withMessage("OTP is required")
        .isLength({ min: 6 }).withMessage("Enter a valid 6 digit OTP"),

]

export const resendOTPValidation = [
    body("email")
        .notEmpty().withMessage("email is required")
        .isEmail().withMessage("Invalid Email. Please enter a valid email"),
]

export const loginValidation = [
    body("email")
        .notEmpty().withMessage("email is required")
        .isEmail().withMessage("Invalid Email. Please enter a valid email"),

    body("password")
        .notEmpty().withMessage("password is required")
        .isLength({ min: 7 }).withMessage("password must be at least of 7 characters"),

]