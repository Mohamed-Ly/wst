import fs from 'fs';
import { transporter } from '../../config/email';

export default function sendMail(htmlTemplate: string, args: string[], sendTo: string, subject: string) {

    let html = fs.readFileSync(`./assets/html/${htmlTemplate}.html`).toString();

    for (let i = 0; i < args.length; i++) {
        html = html.replace(`{{$${i}}}`, args[i])
    }

    const mailOptions = {
        from: process.env.FROM,
        to: sendTo,
        subject: subject,
        html: html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log(error)
            else console.log('Email sent: ' + info.response);
    });
}



