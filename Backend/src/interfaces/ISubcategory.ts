import { Document, Types } from "mongoose"

export interface ISubcategory extends Document {
    // _id:Types.ObjectId,
    name: string,
    slug: string,
    category_id: Types.ObjectId,
    created_at: Date,
    updated_at: Date,
}