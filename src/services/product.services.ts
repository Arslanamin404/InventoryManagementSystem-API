import { IProduct } from "../interfaces/IProduct";
import { Product } from "../models/product.model";


export class ProductServices {
    static async checkExistingProduct(slug: string): Promise<Boolean> {
        const product = await Product.findOne({ slug })
        return !!product;
    }

    static async findProductByID(id: string): Promise<IProduct | null> {
        return await Product.findById(id);
    }

    static async findProductBySlug(slug: string): Promise<IProduct | null> {
        return await Product.findOne({ slug });
    }

    static async deleteProduct(id: string): Promise<IProduct | null> {
        return await Product.findByIdAndDelete(id);
    }

    static async createProduct(new_product: Partial<IProduct>): Promise<IProduct> {
        const product = new Product(new_product)
        return await product.save();
    }

    static async getAllProducts(filters = {}, page: number, limit: number): Promise<IProduct[]> {
        return await Product.find(filters)
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(); //faster query
    }

    static async countProducts(filters = {}) {
        return await Product.countDocuments(filters);
    }
}