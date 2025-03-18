import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import slugify from "slugify";
import { ProductServices } from "../services/product.services";
import { IProduct } from "../interfaces/IProduct";
import { InventoryLogServices } from "../services/inventoryLog.services";
import { IInventoryLog } from "../interfaces/IInventoryLog";
import { CategoryServices } from "../services/category.services";
import { SubcategoryServices } from "../services/subcategory.services";


export class ProductControllers {
    static async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user;
            if (!user) {
                return ApiResponse(res, 400, false, "Unauthorized access. User not found.");
            }

            const { name,
                description,
                category_id,
                subcategory_id,
                price,
                quantity,
                lowStockThreshold } = req.body

            const slug = slugify(name, {
                lower: true,
                strict: true,
                trim: true,
            })

            const parsed_price = Number(price)
            const parsed_quantity = Number(quantity)

            const existingProduct = await ProductServices.checkExistingProduct(slug);
            if (existingProduct) {
                return ApiResponse(res, 400, false, "Product with this name already exists");
            }

            const isCategoryExisting = await CategoryServices.checkExistingCategoryByID(category_id)
            if (!isCategoryExisting)
                return ApiResponse(res, 400, false, "Invalid category_id. No category exists with the given category id")

            if (subcategory_id) {
                const isSubcategoryExisting = await SubcategoryServices.checkExistingSubcategoryByID(subcategory_id)
                if (!isSubcategoryExisting)
                    return ApiResponse(res, 400, false, "Invalid subcategory_id. No subcategory exists with the given category id")
            }



            const new_product: Partial<IProduct> = { name, description, category_id, subcategory_id, slug, price: parsed_price, quantity: parsed_quantity, lowStockThreshold }
            const product = await ProductServices.createProduct(new_product)

            const populatedProduct = await ProductServices.findProductByID(product.id);

            const log: Partial<IInventoryLog> = { product_id: product.id, action: "ADDED", quantityChange: parsed_quantity, performedBy: user.id }

            await InventoryLogServices.createLog(log)


            return ApiResponse(res, 201, true, "Product created successfully", undefined, { product: populatedProduct });
        } catch (error) {
            next(error);
        }
    }

    static async updateProductDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user;
            if (!user) {
                return ApiResponse(res, 400, false, "Unauthorized access. User not found.");
            }

            const { id } = req.params

            const product = await ProductServices.findProductByID(id);
            if (!product) {
                return ApiResponse(res, 400, false, "Product with this id does not exist");
            }


            const { name,
                description,
                category_id,
                subcategory_id,
                price,
                lowStockThreshold } = req.body

            if (name) {
                product.name = name
                product.slug = slugify(product.name, {
                    lower: true,
                    strict: true,
                    trim: true
                })
            }

            if (description)
                product.description = description

            if (category_id)
                product.category_id = category_id

            if (subcategory_id)
                product.subcategory_id = subcategory_id

            const parsed_price = Number(price)

            if (price)
                product.price = parsed_price


            if (lowStockThreshold)
                product.lowStockThreshold = lowStockThreshold

            await product.save();


            return ApiResponse(res, 201, true, "Product updated successfully", undefined, product);
        } catch (error) {
            next(error);
        }
    }

    static async decreaseProductQuantity(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user;
            if (!user) {
                return ApiResponse(res, 400, false, "Unauthorized access. User not found.");
            }

            const { id } = req.params

            const product = await ProductServices.findProductByID(id);
            if (!product) {
                return ApiResponse(res, 404, false, "Product not found. Please check the provided product ID.");
            }

            const oldQuantity = Number(product.quantity);

            const { quantity } = req.body;

            if (!quantity || isNaN(quantity)) {
                return ApiResponse(res, 400, false, "Invalid request. Quantity is required.");
            }

            const new_parsed_quantity = Number(quantity);

            if (new_parsed_quantity <= 0) {
                return ApiResponse(res, 400, false, "Invalid quantity value. Must be greater than zero.");
            }

            if (oldQuantity < new_parsed_quantity) {
                return ApiResponse(res, 400, false, "Insufficient stock. The requested quantity exceeds available stock.");
            }

            product.quantity = oldQuantity - new_parsed_quantity

            if (product.isLowStock()) {
                return ApiResponse(res, 200, true, "Warning: Stock is running low.", undefined, product);
            }

            await product.save();


            const quantityChange = -new_parsed_quantity // negative because stock was decreased

            if (quantityChange !== 0) {
                const log: Partial<IInventoryLog> = {
                    product_id: product.id,
                    action: "REMOVED",
                    quantityChange,
                    performedBy: user.id,
                };
                await InventoryLogServices.createLog(log);
            }

            return ApiResponse(res, 201, true, "Product quantity successfully removed", undefined, product);
        } catch (error) {
            next(error);
        }
    }

    static async increaseProductQuantity(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user;
            if (!user) {
                return ApiResponse(res, 400, false, "Unauthorized access. User not found.");
            }

            const { id } = req.params

            const product = await ProductServices.findProductByID(id);
            if (!product) {
                return ApiResponse(res, 404, false, "Product not found. Please check the provided product ID.");
            }

            const oldQuantity = Number(product.quantity);

            const { quantity } = req.body;

            if (!quantity || isNaN(quantity)) {
                return ApiResponse(res, 400, false, "Invalid request. Quantity is required.");
            }

            const new_parsed_quantity = Number(quantity);

            if (new_parsed_quantity <= 0) {
                return ApiResponse(res, 400, false, "Invalid quantity value. Must be greater than zero.");
            }


            product.quantity = oldQuantity + new_parsed_quantity

            if (product.isLowStock()) {
                return ApiResponse(res, 200, true, "Warning: Stock is running low.", undefined, product);
            }

            await product.save();


            const quantityChange = new_parsed_quantity // positive because stock was increased

            if (quantityChange !== 0) {
                const log: Partial<IInventoryLog> = {
                    product_id: product.id,
                    action: "ADDED",
                    quantityChange,
                    performedBy: user.id,
                };
                await InventoryLogServices.createLog(log);
            }

            return ApiResponse(res, 201, true, "Product quantity successfully added", undefined, product);
        } catch (error) {
            next(error);
        }
    }

    static async updateProductQuantity(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user;
            if (!user) {
                return ApiResponse(res, 400, false, "Unauthorized access. User not found.");
            }

            const { id } = req.params

            const product = await ProductServices.findProductByID(id);
            if (!product) {
                return ApiResponse(res, 404, false, "Product not found. Please check the provided product ID.");
            }

            const { quantity } = req.body;

            if (!quantity || isNaN(quantity)) {
                return ApiResponse(res, 400, false, "Invalid request. Quantity is required.");
            }

            const new_parsed_quantity = Number(quantity);

            if (new_parsed_quantity < 0) {
                return ApiResponse(res, 400, false, "Invalid quantity value. Must be zero or greater.");
            }

            const oldQuantity = Number(product.quantity)
            product.quantity = new_parsed_quantity
            await product.save()


            const quantityChange = new_parsed_quantity - oldQuantity

            if (quantityChange !== 0) {
                const log: Partial<IInventoryLog> = {
                    product_id: product.id,
                    action: "UPDATED",
                    quantityChange,
                    performedBy: user.id,
                };
                await InventoryLogServices.createLog(log);
            }

            return ApiResponse(res, 201, true, "Product quantity successfully added", undefined, product);
        } catch (error) {
            next(error);
        }
    }

    static async fetchAllProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const { page, limit, slug, category } = req.query

            const pageNumber = Math.max(1, Number(page));
            const limitNumber = Math.max(1, Number(limit));

            const filters: any = {}
            if (slug)
                filters.slug = { $regex: slug, $options: "i" }; // Case-insensitive search

            if (category)
                filters.category = category

            const products = await ProductServices.getAllProducts(filters, pageNumber, limitNumber);
            const totalProducts = await ProductServices.countProducts(filters);


            if (products.length === 0)
                return ApiResponse(res, 400, false, "Inventory is empty. No Products found")

            return ApiResponse(res, 200, true, "Products fetched successfully", undefined, {
                products,
                totalProducts,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalProducts / limitNumber)
            })

        } catch (error) {
            next(error)
        }
    }

    static async fetchProductByID(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const product = await ProductServices.findProductByID(id);

            if (!product) {
                return ApiResponse(res, 404, false, "Product not found. Please check the provided product ID.");
            }

            return ApiResponse(res, 200, true, "Products fetched successfully", undefined, { product })

        } catch (error) {
            next(error)
        }
    }

    static async fetchProductBySlug(req: Request, res: Response, next: NextFunction) {
        try {
            const { slug } = req.params
            const product = await ProductServices.findProductBySlug(slug);

            if (!product) {
                return ApiResponse(res, 404, false, "Product not found. Please check the provided product slug.");
            }

            return ApiResponse(res, 200, true, "Products fetched successfully", undefined, { product })

        } catch (error) {
            next(error)
        }
    }

    static async deleteProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const deleted_product = await ProductServices.deleteProduct(id);

            if (!deleted_product) {
                return ApiResponse(res, 404, false, "Product not found. Please check the provided product id.");
            }

            return ApiResponse(res, 200, true, "Products deleted successfully")

        } catch (error) {
            next(error)
        }
    }

    static async isLowStock(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const product = await ProductServices.findProductByID(id);

            if (!product) {
                return ApiResponse(res, 404, false, "Product not found. Please check the provided product ID.");
            }

            if (product.isLowStock()) {
                return ApiResponse(res, 200, true, "Product is in low stock.");
            } else {
                return ApiResponse(res, 200, true, "Product has sufficient stock.");
            }
        } catch (error) {
            next(error);
        }
    }



}

