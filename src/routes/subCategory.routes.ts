import { Router, Request, Response, NextFunction } from "express";
import { SubcategoryControllers } from "../controllers/subcategory.controller";

const subcategoryRouter = Router();


// Create a new subcategory
subcategoryRouter.post("/", (req: Request, res: Response, next: NextFunction) => {
    SubcategoryControllers.createSubcategory(req, res, next)
})

subcategoryRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
    SubcategoryControllers.fetchAllSubcategories(req, res, next)
})

subcategoryRouter.get("/:id", (req: Request, res: Response, next: NextFunction) => {
    SubcategoryControllers.fetchSubcategoryByID(req, res, next)
})

subcategoryRouter.get("/slug/:slug", (req: Request, res: Response, next: NextFunction) => {
    SubcategoryControllers.fetchSubcategoryBySlug(req, res, next)
})

// edit subcategory
subcategoryRouter.put("/:id", (req: Request, res: Response, next: NextFunction) => {
    SubcategoryControllers.updateSubcategory(req, res, next)
})

// delete subcategory
subcategoryRouter.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
    SubcategoryControllers.deleteSubcategory(req, res, next)
})


export default subcategoryRouter