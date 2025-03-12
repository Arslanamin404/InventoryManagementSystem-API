import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import slugify from "slugify";
import { SubcategoryServices } from "../services/subcategory.services";
import { ISubcategory } from "../interfaces/ISubcategory";

export class SubcategoryControllers {
    static async createSubcategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, category_id } = req.body;
            if (!name)
                return ApiResponse(res, 400, false, "Invalid request. Name is required.");

            const slug = slugify(name, {
                lower: true,
                trim: true,
                strict: true
            })

            const existingSubcategory = await SubcategoryServices.checkExistingSubcategory(slug)
            if (existingSubcategory)
                return ApiResponse(res, 400, false, "Subcategory with this name already exists")


            const new_subcategory: Partial<ISubcategory> = { name, slug, category_id }

            await SubcategoryServices.createSubcategory(new_subcategory)
            return ApiResponse(res, 201, true, "Subcategory created successfully")

        } catch (error) {
            next(error)
        }
    }

    static async updateSubcategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { name } = req.body

            const subcategory = await SubcategoryServices.findSubcategoryByID(id);
            if (!subcategory)
                return ApiResponse(res, 400, false, "No subcategory exist with this id")

            if (name) {
                subcategory.name = name

                const slug = slugify(name, {
                    lower: true,
                    trim: true,
                    strict: true
                })
                subcategory.slug = slug

                await subcategory.save()
            }
            return ApiResponse(res, 200, true, "Subcategory updated successfully", undefined, { subcategory })
        } catch (error) {
            next(error)
        }
    }

    static async deleteSubcategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const deleted_subcategory = await SubcategoryServices.deleteSubcategory(id);
            if (!deleted_subcategory)
                return ApiResponse(res, 400, false, "No subcategory exist with this id")


            return ApiResponse(res, 200, true, "Subcategory deleted successfully")
        } catch (error) {
            next(error)
        }
    }

    static async fetchAllSubcategories(req: Request, res: Response, next: NextFunction) {
        try {
            const subcategories = await SubcategoryServices.getAllSubcategories();

            if (subcategories.length === 0)
                return ApiResponse(res, 400, false, "Subcategory list is empty. No subcategories found")

            return ApiResponse(res, 200, true, "Subcategories fetched successfully", undefined, { subcategories })
        } catch (error) {
            next(error)
        }
    }

    static async fetchSubcategoryByID(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const subcategory = await SubcategoryServices.findSubcategoryByID(id);

            if (!subcategory)
                return ApiResponse(res, 400, false, "Invalid request. No sub category found with the given id")

            return ApiResponse(res, 200, true, "subcategory fetched successfully", undefined, { subcategory })
        } catch (error) {
            next(error)
        }
    }

    static async fetchSubcategoryBySlug(req: Request, res: Response, next: NextFunction) {
        try {
            const { slug } = req.params
            const subcategory = await SubcategoryServices.findSubcategoryBySlug(slug);

            if (!subcategory)
                return ApiResponse(res, 400, false, "Invalid request. No sub category found with the given slug")

            return ApiResponse(res, 200, true, "Subcategory fetched successfully", undefined, { subcategory })
        } catch (error) {
            next(error)
        }
    }
}