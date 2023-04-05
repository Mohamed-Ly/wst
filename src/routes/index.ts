import express from "express";
import * as utils from '../controllers/index'
const index = express.Router();

index.get("/email-verification", utils.emailVerification);

export default index;
