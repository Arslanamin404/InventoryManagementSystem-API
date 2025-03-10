import { IInventoryLog } from "../interfaces/IInventoryLog";
import { InventoryLog } from "../models/inventoryLog.model";

export class InventoryLogServices {
    static async createLog(log: Partial<IInventoryLog>): Promise<IInventoryLog> {
        const new_log = new InventoryLog(log)
        return await new_log.save();
    }

    static async getAllLogs(): Promise<IInventoryLog[]> {
        return await InventoryLog.find().populate("user", "first_name email phone_number role");
    }

    static async getLogByID(id: string): Promise<IInventoryLog | null> {
        return await InventoryLog.findById(id).populate("user", "first_name username email phone_number role");
    }

}