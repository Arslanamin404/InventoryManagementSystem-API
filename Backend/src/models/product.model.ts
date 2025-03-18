import mongoose, { Schema, Model, model } from "mongoose"
import { IProduct } from "../interfaces/IProduct"


const ProductSchema: Schema<IProduct> = new Schema({
    name: {
        type: String,
        required: [true, "product name is required"],
    },
    description: {
        type: String,
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Category is required"],
    },
    subcategory_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory"
    },
    slug: {
        type: String,
        required: [true, "Product slug is required"],
        unique: [true, "Please enter a unique slug"],
        minlength: [4, "Category slug must be at least of 4 characters"],
        lowercase: true,
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        default: 0
    },
    quantity: {
        type: Number,
        required: [true, "Product quantity is required"],
        default: 0
    },
    lowStockThreshold: {
        type: Number,
        required: [true, "Product lowStockThreshold is required"],
        default: 2
    },

}, { timestamps: true })

ProductSchema.methods.isLowStock = function (): Boolean {
    return this.quantity <= this.lowStockThreshold
}


export const Product: Model<IProduct> = model("Product", ProductSchema)