import {Response} from 'express';

export const validationError = (massage: string, res: Response) => {
    res.status(400).json({ error: massage })
}

export const unauthorizedError = (res: Response) => {
    res.redirect("/sing-up")
    res.status(401).json({ error: "unauthorized" })
}

export const forbiddenError = (res: Response) => {
    res.status(403).json({ error: "forbidden" })
}

