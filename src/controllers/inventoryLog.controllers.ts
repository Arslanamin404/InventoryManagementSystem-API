import { Router, Request, Response, NextFunction } from "express";
import { InventoryLogServices } from "../services/inventoryLog.services";
import { ApiResponse } from "../utils/ApiResponse";

export class InventoryLogControllers {
    static async fetchAllLogs(req: Request, res: Response, next: NextFunction) {
        try {
            const logs = await InventoryLogServices.getAllLogs()
            if (logs.length === 0)
                return ApiResponse(res, 400, false, "Inventory Log list is empty. No inventory logs found")

            return ApiResponse(res, 201, true, "Inventory Logs fetched successfully", undefined, { logs })
        } catch (error) {
            next(error)
        }
    }
    static async fetchLogByID(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const log = await InventoryLogServices.getLogByID(id)
            if (!log)
                return ApiResponse(res, 400, false, "Inventory log does not exist with the given id")

            return ApiResponse(res, 201, true, "Inventory Log fetched successfully", undefined, { log })
        } catch (error) {
            next(error)
        }
    }
}