import express from 'express';
import connection from '../controllers/connection.controller.js';
const connectionRouter = express.Router();

connectionRouter.get('/connection', connection.get);
connectionRouter.get('/status', connection.status);
connectionRouter.get('/qr', connection.qr);
connectionRouter.delete('/logout', connection.logout);

export default connectionRouter;