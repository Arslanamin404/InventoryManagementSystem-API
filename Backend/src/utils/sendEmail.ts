import nodemailer from "nodemailer"
import { config } from "../config/env"


export const sendEmail = async (email: string, subject: string, text: string | undefined, html: string): Promise<void> => {
    const transporter = nodemailer.createTransport({
        host: config.EMAIL_HOST as string,
        port: Number(config.EMAIL_PORT),
        secure: true, // true for port 465, false for other ports
        auth: {
            user: config.EMAIL_USER,
            pass: config.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: config.EMAIL_USER,
        to: email,
        subject,
        text,
        html
    })
}