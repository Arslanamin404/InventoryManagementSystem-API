import mongoose from "mongoose";
import { config } from "../config/env"

export const connectDB = async () => {
    try {
        await mongoose.connect(config.DB_URL)
        console.log(`Connected to MongoDB successfully! `)
    } catch (error) {
        console.log(`Error occurred while connecting to MongoDB: '${error}'`)
        process.exit(1)
    }
}