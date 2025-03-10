import { ICategory } from "../interfaces/ICategory";
import { Category } from "../models/category.model";


export class CategoryServices {
    static async checkExistingCategory(slug: string): Promise<Boolean> {
        const category = await Category.findOne({ slug })
        return !!category;
    }

    static async findCategoryByID(id: string): Promise<ICategory | null> {
        return await Category.findById(id);
    }

    static async findCategoryBySlug(slug: string): Promise<ICategory | null> {
        return await Category.findOne({ slug });
    }

    static async deleteCategory(id: string): Promise<ICategory | null> {
        return await Category.findByIdAndDelete(id);
    }

    static async createCategory(new_category: Partial<ICategory>): Promise<ICategory> {
        const category = new Category(new_category)
        return await category.save();
    }

    static async getAllCategories(): Promise<ICategory[]> {
        return await Category.find()
    }
}