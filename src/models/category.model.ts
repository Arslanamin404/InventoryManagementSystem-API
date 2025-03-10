import { model, Model, Schema } from "mongoose"
import { ICategory } from "../interfaces/ICategory"

const CategorySchema: Schema<ICategory> = new Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
    },
    slug: {
        type: String,
        required: [true, "Category slug is required"],
        unique: [true, "Category slug must be unique"],
        minlength: [4, "Category slug must be at least of 4 characters"],
        lowercase: true
    },
}, { timestamps: true })

export const Category: Model<ICategory> = model("Category", CategorySchema)