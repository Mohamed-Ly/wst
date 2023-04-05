import { NextFunction, Request, Response } from "express";
import { validationError } from "../utils/errors";

export default async function recaptcha(req: Request, res: Response, next: NextFunction) {
    const recaptcha_token = req.body["recaptcha_token"];

    if (typeof recaptcha_token !== "string") {
        validationError("خانه أنا لست برنامج روبوت مطلوبه", res);
        return;
    }

    fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RE_CAPTCHA}&response=${recaptcha_token}`, { method: "post" })
        .then((response) => response.json())
        .then((google_response) => {
            if (google_response.success == true) next()
            else {
                validationError("خانه أنا لست برنامج روبوت مطلوبه", res);
                return;
            }
        })
        .catch((error) => {
            validationError("خانه أنا لست برنامج روبوت مطلوبه", res);
            return;
        });
}
