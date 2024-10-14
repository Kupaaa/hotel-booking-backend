import express from 'express'
import { createRoom, deleteRoom, findRoomById, getRoom, updateRoom } from '../controllers/roomController.js';

const roomRoute = express();

roomRoute.post("/", createRoom);
roomRoute.get("/", getRoom);
roomRoute.get("/:roomId", findRoomById);
roomRoute.delete("/:roomId", deleteRoom);
roomRoute.put("/:roomId", updateRoom);




export default roomRoute;