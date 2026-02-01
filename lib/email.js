import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER

export async function sendPasswordResetOtp({ toEmail, code }) {
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    if (!user || !pass) {
        throw new Error('SMTP_USER and SMTP_PASS must be set in .env. Use Gmail address and App Password.')
    }

    await transporter.sendMail({
        from: fromEmail || user,
        to: toEmail,
        subject: 'Linkium – Your password reset code',
        html: `<p>Your reset code is: <strong>${code}</strong></p><p>It expires in 10 minutes.</p>`,
    })
}
