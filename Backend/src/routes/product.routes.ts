import { Router, Request, Response, NextFunction } from "express";
import { validate } from "../middlewares/validation.middleware";
import { createProductValidation } from "../validations/product.validation";
import { ProductControllers } from "../controllers/product.controller";
import { authenticate } from "../middlewares/auth.middleware";

const productRouter = Router();


// Create a new product
productRouter.post("/", authenticate, createProductValidation, validate, (req: Request, res: Response, next: NextFunction) => {
    ProductControllers.createProduct(req, res, next);
})

// Get all products (with filters & pagination).
productRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
    ProductControllers.fetchAllProducts(req, res, next);
})

// Get a product by ID.
productRouter.get("/:id", (req: Request, res: Response, next: NextFunction) => {
    ProductControllers.fetchProductByID(req, res, next);
})

// GET a product by its slug.
productRouter.get("/slug/:slug", (req: Request, res: Response, next: NextFunction) => {
    ProductControllers.fetchProductBySlug(req, res, next);
})

// Update a product details
productRouter.put("/:id", authenticate, (req: Request, res: Response, next: NextFunction) => {
    ProductControllers.updateProductDetails(req, res, next);
})

// Increase product quantity
productRouter.put("/increase-quantity/:id", authenticate, (req: Request, res: Response, next: NextFunction) => {
    ProductControllers.increaseProductQuantity(req, res, next);
})

// Decrease product quantity
productRouter.put("/decrease-quantity/:id", authenticate, (req: Request, res: Response, next: NextFunction) => {
    ProductControllers.decreaseProductQuantity(req, res, next);
})

// Update product quantity
productRouter.put("/decrease-quantity/:id", authenticate, (req: Request, res: Response, next: NextFunction) => {
    ProductControllers.updateProductQuantity(req, res, next);
})

// Delete a product
productRouter.delete("/:id", authenticate, (req: Request, res: Response, next: NextFunction) => {
    ProductControllers.deleteProduct(req, res, next)
})

productRouter.get("/isLowStock/:id", authenticate, (req: Request, res: Response, next: NextFunction) => {
    ProductControllers.isLowStock(req, res, next)
})

export default productRouter