import { IInventoryLog } from "../interfaces/IInventoryLog";
import { InventoryLog } from "../models/inventoryLog.model";

export class InventoryLogServices {
    static async createLog(log: Partial<IInventoryLog>): Promise<IInventoryLog> {
        const new_log = new InventoryLog(log)
        return await new_log.save();
    }

    static async getAllLogs(): Promise<IInventoryLog[]> {
        return await InventoryLog.find()
            .populate("performedBy", "first_name username email phone_number role")
            .populate("product_id", "name slug price quantity");
    }

    static async getLogByID(id: string): Promise<IInventoryLog | null> {
        return await InventoryLog.findById(id)
            .populate("performedBy", "first_name username email phone_number role")
            .populate("product_id", "name slug price quantity");
    }

    static async getLogsByUserID(id: string): Promise<IInventoryLog[]> {
        return await InventoryLog.find({ performedBy: id })
            .populate("performedBy", "first_name username email phone_number role")
            .populate("product_id", "name slug price quantity");
    }

}