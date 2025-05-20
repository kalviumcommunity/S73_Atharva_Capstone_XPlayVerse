import express from 'express';
import { GETROOM, POSTROOM } from '../controller/roomController.js';

const roomRouter = express.Router();

roomRouter.get('/', GETROOM);
roomRouter.post('/', POSTROOM);

export default roomRouter;
