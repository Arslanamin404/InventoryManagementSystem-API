import { IUser } from '../interfaces/IUser';
import { model, Model, Schema } from "mongoose"
import bcrypt from "bcrypt"

const UserSchema: Schema<IUser> = new Schema({
    first_name: {
        type: String,
        minlength: [5, "first_name must be at least of 5 character"],
        required: [true, "first_name is required"]
    },
    last_name: {
        type: String,
    },
    username: {
        type: String,
        required: [true, "username is required"],
        unique: [true, "username already taken"],
        lowercase: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "email already taken"],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: [7, "password must be at least of 7 characters"],
    },
    phone_number: {
        type: String,
        required: [true, "phone_number is required"],
        minlength: [10, "INVALID phone_number! Please enter a valid 10-digit phone_number."],
        maxlength: [10, "INVALID phone_number! Please enter a valid 10-digit phone_number."],
        unique: [true, "phone_number already registered"]
    },
    role: {
        type: String,
        enum: ["ADMIN", "STAFF"],
        default: "STAFF"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
    },
    otp: {
        type: String,
    },
    otpExpiresAt: {
        type: Date,
    },

}, { timestamps: true })


UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next()
    }
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next()
    } catch (error) {
        next(error as Error)
    }
})

UserSchema.methods.comparePassword = async function (incomingPassword: string): Promise<Boolean> {
    return await bcrypt.compare(incomingPassword, this.password)

}

export const User: Model<IUser> = model("User", UserSchema)