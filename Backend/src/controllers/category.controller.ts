import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { ICategory } from "../interfaces/ICategory";
import slugify from "slugify";
import { CategoryServices } from "../services/category.services";

export class CategoryControllers {
    static async createCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.body;
            if (!name)
                return ApiResponse(res, 400, false, "Invalid request. Name is required.");

            const slug = slugify(name, {
                lower: true,
                trim: true,
                strict: true
            })

            const existingCategory = await CategoryServices.checkExistingCategory(slug)
            if (existingCategory)
                return ApiResponse(res, 400, false, "Category with this name already exists")


            const new_category: Partial<ICategory> = { name, slug }

            await CategoryServices.createCategory(new_category)
            return ApiResponse(res, 201, true, "Category created successfully")

        } catch (error) {
            next(error)
        }
    }

    static async updateCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { name } = req.body

            const category = await CategoryServices.findCategoryByID(id);
            if (!category)
                return ApiResponse(res, 400, false, "No category exist with this id")

            if (name) {
                category.name = name

                const slug = slugify(name, {
                    lower: true,
                    trim: true,
                    strict: true
                })
                category.slug = slug

                await category.save()
            }
            return ApiResponse(res, 201, true, "Category updated successfully", undefined, { category })
        } catch (error) {
            next(error)
        }
    }

    static async deleteCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const deleted_category = await CategoryServices.deleteCategory(id);
            if (!deleted_category)
                return ApiResponse(res, 400, false, "No category exist with this id")


            return ApiResponse(res, 201, true, "Category deleted successfully")
        } catch (error) {
            next(error)
        }
    }

    static async fetchAllCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await CategoryServices.getAllCategories();

            if (categories.length === 0)
                return ApiResponse(res, 400, false, "Category list is empty. No categories found")

            return ApiResponse(res, 201, true, "Categories fetched successfully", undefined, { categories })
        } catch (error) {
            next(error)
        }
    }

    static async fetchCategoryByID(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const category = await CategoryServices.findCategoryByID(id);

            if (!category)
                return ApiResponse(res, 400, false, "Invalid request. No categories found with the given id")

            return ApiResponse(res, 201, true, "Category fetched successfully", undefined, { category })
        } catch (error) {
            next(error)
        }
    }

    static async fetchCategoryBySlug(req: Request, res: Response, next: NextFunction) {
        try {
            const { slug } = req.params
            const category = await CategoryServices.findCategoryBySlug(slug);

            if (!category)
                return ApiResponse(res, 400, false, "Invalid request. No categories found with the given slug")

            return ApiResponse(res, 201, true, "Category fetched successfully", undefined, { category })
        } catch (error) {
            next(error)
        }
    }
}