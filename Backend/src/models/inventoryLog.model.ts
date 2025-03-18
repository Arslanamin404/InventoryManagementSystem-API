import mongoose, { model, Model, Schema } from "mongoose"
import { IInventoryLog } from "../interfaces/IInventoryLog"

const InventoryLogSchema: Schema<IInventoryLog> = new Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    action: {
        type: String,
        enum: ["ADDED", "REMOVED", "UPDATED"],
        required: [true, "Action on inventory is required"]
    },
    quantityChange: {
        type: Number,
        required: [true, "Quantity Change is required"]
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    }
}, { timestamps: true })

export const InventoryLog: Model<IInventoryLog> = model("InventoryLog", InventoryLogSchema)