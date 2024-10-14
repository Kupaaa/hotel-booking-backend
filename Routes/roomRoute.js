import express from 'express'
import { createRoom, deleteRoom, findRoomById, getRoom } from '../controllers/roomController.js';

const roomRoute = express();

roomRoute.post("/", createRoom);
roomRoute.get("/", getRoom);
roomRoute.get("/:roomId", findRoomById);
roomRoute.delete("/:roomId", deleteRoom);



export default roomRoute;