import { ISubcategory } from "../interfaces/ISubcategory";
import { Subcategory } from "../models/subcategory.model";

export class SubcategoryServices {
    static async checkExistingSubcategory(slug: string): Promise<Boolean> {
        const subcategory = await Subcategory.findOne({ slug })
        return !!subcategory;
    }

    static async findSubcategoryByID(id: string): Promise<ISubcategory | null> {
        return await Subcategory.findById(id);
    }

    static async findSubcategoryBySlug(slug: string): Promise<ISubcategory | null> {
        return await Subcategory.findOne({ slug });
    }

    static async deleteSubcategory(id: string): Promise<ISubcategory | null> {
        return await Subcategory.findByIdAndDelete(id);
    }

    static async createSubcategory(new_subcategory: Partial<ISubcategory>): Promise<ISubcategory> {
        const subcategory = new Subcategory(new_subcategory)
        return await subcategory.save();
    }

    static async getAllSubcategories(): Promise<ISubcategory[]> {
        return await Subcategory.find()
    }
}