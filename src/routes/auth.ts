import express from "express";
import * as authControllers from '../controllers/auth'
const auth = express.Router();

auth.post("/sing-up", authControllers.singUp)
auth.post("/login", authControllers.login)
auth.get("/logout", authControllers.logout)

export default auth;
