import express from "express";
import {
  createRoom,
  deleteRoom,
  findRoomById,
  getRoom,
  getRoomByCategory,
  updateRoom,
} from "../controllers/roomController.js";
import { checkAdminAuth, checkAuth } from "../services/checkRole.js";

const roomRoute = express();

// Route to handle operations related to room management
roomRoute.post("/", checkAuth, checkAdminAuth, createRoom); // Route to create a new room (requires both login and admin privileges)
roomRoute.get("/", getRoom); // Route to retrieve all rooms (public access, no login required)
roomRoute.get("/:roomId", findRoomById); // Route to find a specific room by its ID (public access, no login required)
roomRoute.delete("/:roomId", checkAuth, checkAdminAuth, deleteRoom); // Route to delete a room by its ID (requires both login and admin privileges)
roomRoute.put("/:roomId", checkAuth, checkAdminAuth, updateRoom); // Route to update a room by its ID (requires both login and admin privileges)
roomRoute.get("/category/:category", getRoomByCategory); // Route to get rooms by their category (public access, no login required)

export default roomRoute;
