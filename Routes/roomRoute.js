import express from 'express'
import { createRoom, getRoom } from '../controllers/roomController.js';

const roomRoute = express();

roomRoute.post("/", createRoom);
roomRoute.get("/", getRoom);



export default roomRoute;