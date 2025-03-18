export interface ITokenPayload {
    id: string;
    email: string;
    role: "STAFF" | "ADMIN";
}