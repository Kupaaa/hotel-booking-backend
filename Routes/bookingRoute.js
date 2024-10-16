import express from "express";
import {
  createBooking,
  deleteBookingById,
  getBooking,
  getBookingById,
  updateBookingById,
} from "../controllers/bookingController.js";
import { checkAdminAuth, checkAuth } from "../services/checkRole.js";

const bookingRouter = express.Router();

// Route to handle operations related to booking management
bookingRouter.post("/", checkAuth, createBooking); // Route to create a new booking (requires authentication)
bookingRouter.delete("/:bookingId", checkAuth, checkAdminAuth, deleteBookingById); // Route to delete a booking by ID (requires both login and admin privileges)
bookingRouter.get("/", checkAuth, checkAdminAuth, getBooking); // Route to retrieve all bookings (requires both login and admin privileges)
bookingRouter.get("/:bookingId", checkAuth, checkAdminAuth, getBookingById); // Route to retrieve a booking by ID (requires both login and admin privileges)
bookingRouter.put("/:bookingId", checkAuth, checkAdminAuth, updateBookingById); // Route to update a booking by ID (requires both login and admin privileges)

export default bookingRouter;
