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

// Route to handle operations related to room management
roomRoute.post("/", createRoom); // Route to create a new room
roomRoute.get("/", getRoom); // Route to retrieve all rooms
roomRoute.get("/:roomId", findRoomById); // Route to find a specific room by its ID
roomRoute.delete("/:roomId", deleteRoom); // Route to delete a room by its ID
roomRoute.put("/:roomId", updateRoom); // Route to update a room by its ID
roomRoute.get("/category/:category", getRoomByCategory); // Route to get rooms by their category

export default roomRoute;
