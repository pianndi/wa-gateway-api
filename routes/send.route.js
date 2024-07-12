import express from "express";
import send from "../controllers/send.controller.js"


const sendRouter = express.Router();
sendRouter.use(send.validateNumber);
sendRouter.post('/text', send.text);

export default sendRouter;