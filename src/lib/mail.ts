import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === "465",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    // TLS certificate validation is enabled by default for security
    // Only disable in development if you have self-signed certificates
    ...(process.env.NODE_ENV === "development" && process.env.SMTP_REJECT_UNAUTHORIZED === "false"
        ? { tls: { rejectUnauthorized: false } }
        : {}),
});

export const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
    try {
        const info = await transporter.sendMail({
            from: `"Phojaa Real Estate" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });
        return { success: true, messageId: info.messageId };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return { success: false, error: errorMessage };
    }
};
