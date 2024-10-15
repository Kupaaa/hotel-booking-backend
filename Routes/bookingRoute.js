import express from "express"
import { createBooking } from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/", createBooking); // Route to create a new booking

export default bookingRouter;