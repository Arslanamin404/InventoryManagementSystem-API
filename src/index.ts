import express, { Application } from "express";
import { connectDB } from "./config/database"
import { config } from "./config/env";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware";
import authRouter from "./routes/auth.routes";
import statusRouter from "./routes/status.route";
import userRouter from "./routes/user.routes";
import { authenticate } from "./middlewares/auth.middleware";
import productRouter from "./routes/product.routes";
import categoryRouter from "./routes/category.routes";
import subCategoryRouter from "./routes/subCategory.routes";
import cors from "cors"
import inventoryLogRouter from "./routes/inventorylog.routes";


const PORT = config.PORT;

const app: Application = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

connectDB()

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())


app.use("/api/v1/status", statusRouter)
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/users", authenticate, userRouter);
app.use("/api/v1/products", authenticate, productRouter);
app.use("/api/v1/categories", authenticate, categoryRouter);
app.use("/api/v1/subcategories", authenticate, subCategoryRouter);
app.use("/api/v1/inventory-logs", authenticate, inventoryLogRouter);


// Error handler should be the LAST middleware
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);

})