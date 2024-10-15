import express from "express";
import {
  createRoom,
  deleteRoom,
  findRoomById,
  getRoom,
  getRoomByCategory,
  updateRoom,
} from "../controllers/roomController.js";

const roomRoute = express();

roomRoute.post("/", createRoom);
roomRoute.get("/", getRoom);
roomRoute.get("/:roomId", findRoomById);
roomRoute.delete("/:roomId", deleteRoom);
roomRoute.put("/:roomId", updateRoom);
roomRoute.get("/category/:category", getRoomByCategory);

export default roomRoute;
