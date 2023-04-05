import { Request, Response } from 'express'
import context from '../config/context'
import { VerifyJwt, generateJwt } from '../services/auth/jwt';


export async function emailVerification(req: Request, res: Response) {
    const token = req.query["token"];

    if (typeof token !== "string") {
        res.status(404)
        return;
    }

    const {payload, error} = VerifyJwt(token);

    if (error) {
        res.status(404)
        return;
    }

    const user = await context.user.update({
        where: { id: Number(payload.id) },
        data: { verified_email: true },
        select: { role: true }
    })

    const refreshToken = generateJwt((60 * 24 * 60 * 60 * 1000), [{name: "role", value: user.role}, {name: "id", value: payload.id}])
    const accessToken = generateJwt((15 * 60 * 1000), [{name: "role", value: user.role}, {name: "id", value: payload.id}])

    res.setHeader('Set-Cookie', [
        `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=${15 * 60}; SameSite=strict; Secure=${process.env.NODE_ENV === "production" ? "True" : "False"};`,
        `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${60 * 24 * 60 * 60}; SameSite=strict; Secure=${process.env.NODE_ENV === "production" ? "True" : "False"};`
    ]);

    res.status(200).redirect("/email-verification.html")
}
