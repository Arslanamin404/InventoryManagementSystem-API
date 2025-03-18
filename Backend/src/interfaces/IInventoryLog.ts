import { Document, Types } from "mongoose"

export interface IInventoryLog extends Document {
    // _id:Types.ObjectId,
    product_id: Types.ObjectId,
    action: "ADDED" | "REMOVED" | "UPDATED"
    quantityChange: number,
    performedBy: Types.ObjectId,
    created_at: Date,
    updated_at: Date,
}