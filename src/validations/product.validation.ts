import { body } from "express-validator";

export const createProductValidation = [
    body("name")
        .notEmpty().withMessage("product name is required"),

    body("description")
        .optional(),

    body("category_id")
        .notEmpty().withMessage("category_id is required")
        .isMongoId().withMessage("Invalid category_id. Please enter a valid category_id"),

    body("subcategory_id")
        .optional()
        .isMongoId().withMessage("Invalid category_id. Please enter a valid category_id"),

    body("price")
        .notEmpty().withMessage("product price is required")
        .isNumeric().withMessage("Price must be an integer"),

    body("quantity")
        .notEmpty().withMessage("product quantity is required")
        .isNumeric().withMessage("product quantity must be an integer"),

    body("lowStockThreshold")
        .notEmpty().withMessage("product lowStockThreshold is required")
        .isNumeric().withMessage("product lowStockThreshold must be an integer")

]

