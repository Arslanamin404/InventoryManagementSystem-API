import { Document, Types } from "mongoose"

export interface ICategory extends Document {
    // _id:Types.ObjectId,
    name: string,
    slug: string,
    created_at: Date,
    updated_at: Date,
}