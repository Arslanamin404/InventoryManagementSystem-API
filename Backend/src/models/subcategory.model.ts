import mongoose, { model, Model, Schema } from "mongoose"
import { ISubcategory } from "../interfaces/ISubcategory"

const SubcategorySchema: Schema<ISubcategory> = new Schema({
    name: {
        type: String,
        required: [true, "Subcategory name is required"],
    },

    slug: {
        type: String,
        required: [true, "Subcategory slug is required"],
        unique: [true, "Subcategory slug must be unique"],
        minlength: [4, "Subcategory slug must be at least of 4 characters"],
        lowercase: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Category is required"],
    }
}, { timestamps: true })

export const Subcategory: Model<ISubcategory> = model("Subcategory", SubcategorySchema)