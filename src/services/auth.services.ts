import { IUser } from "../interfaces/IUser";
import { User } from "../models/user.model";

export class AuthServices {
    static async checkExistingUser(email: string): Promise<Boolean> {
        const user = await User.findOne({ email })
        return !!user;
    }

    static async createUser(new_user: Partial<IUser>): Promise<IUser> {
        const user = new User(new_user);
        return await user.save()
    }

    static async findUserByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ email })
    }

    static async findUserByID(id: string): Promise<IUser | null> {
        return await User.findById(id).select("-password");
    }

    static async findUserByRefreshToken(refreshToken: string): Promise<IUser | null> {
        return await User.findOne({ refreshToken })
    }

    static async getAllUsers() {
        try {
            return await User.find({});
        } catch (error) {
            console.error("Error fetching users:", error);
            throw new Error("Failed to fetch users");
        }
    }

    static async deleteUserByID(id: string) {
        return await User.findByIdAndDelete(id)
    }


}