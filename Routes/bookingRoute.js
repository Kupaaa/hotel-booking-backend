import express from "express";
import {
  createBooking,
  deleteBookingById,
  getBooking,
  getBookingById,
  updateBookingById,
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

// Route to handle operations related to booking management
bookingRouter.post("/", createBooking); // Route to create a new booking
bookingRouter.delete("/:bookingId", deleteBookingById); // Route to delete a booking by ID
bookingRouter.get("/", getBooking); // Route to retrieve all bookings
bookingRouter.get("/:bookingId", getBookingById); // Route to retrieve a booking by ID
bookingRouter.put("/:bookingId", updateBookingById); // Route to update a booking by ID

export default bookingRouter;
