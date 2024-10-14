import express from 'express'
import { createRoom, findRoomById, getRoom } from '../controllers/roomController.js';

const roomRoute = express();

roomRoute.post("/", createRoom);
roomRoute.get("/", getRoom);
roomRoute.get("/:roomId", findRoomById)



export default roomRoute;