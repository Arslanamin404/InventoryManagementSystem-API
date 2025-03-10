import { Document, Types } from "mongoose"


export interface IUser extends Document {
    // _id: Types.ObjectId,
    first_name: string,
    last_name?: string,
    username: string,
    email: string,
    password: string,
    phone_number: string,
    role: "ADMIN" | "STAFF",
    isVerified: boolean,
    refreshToken?: string,
    otp?: string,
    otpExpiresAt?: Date,
    created_at: Date,
    updated_at: Date,
    comparePassword(incomingPassword: string): Promise<Boolean>,
}