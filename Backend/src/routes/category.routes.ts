import { Router, Request, Response, NextFunction } from "express";
import { CategoryControllers } from "../controllers/category.controller";

const categoryRouter = Router();


// Create a new category
categoryRouter.post("/", (req: Request, res: Response, next: NextFunction) => {
    CategoryControllers.createCategory(req, res, next)
})

categoryRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
    CategoryControllers.fetchAllCategories(req, res, next)
})

categoryRouter.get("/:id", (req: Request, res: Response, next: NextFunction) => {
    CategoryControllers.fetchCategoryByID(req, res, next)
})

categoryRouter.get("/slug/:slug", (req: Request, res: Response, next: NextFunction) => {
    CategoryControllers.fetchCategoryBySlug(req, res, next)
})

// edit category
categoryRouter.put("/:id", (req: Request, res: Response, next: NextFunction) => {
    CategoryControllers.updateCategory(req, res, next)
})

// delete category
categoryRouter.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
    CategoryControllers.deleteCategory(req, res, next)
})


export default categoryRouter