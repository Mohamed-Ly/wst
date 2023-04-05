import express from "express";
import * as authControllers from '../controllers/auth'
import recaptcha from "../middleware/recaptcha";
const auth = express.Router();

auth.post("/sing-up", recaptcha, authControllers.singUp)
auth.post("/login", recaptcha, authControllers.login)
auth.get("/logout", authControllers.logout)

export default auth;
