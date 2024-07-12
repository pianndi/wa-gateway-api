import express from "express";
import misc from "../controllers/misc.controller.js"

const miscRouter = express.Router();

miscRouter.get('/profile', misc.profile);

export default miscRouter;