import nodemailer from 'nodemailer';

export const  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.FROM,
        pass: process.env.APP_PASSWORD
    }
});
