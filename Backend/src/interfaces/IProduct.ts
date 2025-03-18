import { Document, Types } from "mongoose"

export interface IProduct extends Document {
    // _id: Types.ObjectId
    name: string,
    description?: string,
    category_id: Types.ObjectId,
    subcategory_id?: Types.ObjectId,
    slug: string,
    price: Number,
    quantity: Number,
    lowStockThreshold: Number,
    created_at: Date,
    updated_at: Date,
    isLowStock(): Boolean
} 