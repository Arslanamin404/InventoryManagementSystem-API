import { Router, Request, Response, NextFunction } from "express";
import { InventoryLogControllers } from "../controllers/inventoryLog.controllers";


const inventoryLogRouter = Router();

inventoryLogRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
    InventoryLogControllers.fetchAllLogs(req, res, next)
})

inventoryLogRouter.get("/:id", (req: Request, res: Response, next: NextFunction) => {
    InventoryLogControllers.fetchLogByID(req, res, next)
})

inventoryLogRouter.get("/user/:id", (req: Request, res: Response, next: NextFunction) => {
    InventoryLogControllers.fetchLogByUserID(req, res, next)
})

export default inventoryLogRouter