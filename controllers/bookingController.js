import Booking from "../models/booking.js";
import {
  isLoggedIn,
  isCustomerValid,
  isAdminValid,
} from "../services/checkRole.js";

// Function to create a new booking in the system
export const createBooking = async (req, res) => {
  try {
    // Check if the user is logged in
    if (!isLoggedIn(req)) {
      return res.status(403).json({
        message: "Please log in to create a booking.",
      });
    }

    // Check if the user is a customer or an admin
    const isCustomer = isCustomerValid(req);
    const isAdmin = isAdminValid(req);

    if (!isCustomer && !isAdmin) {
      return res.status(403).json({
        message: "Only customers or admins can create bookings.",
      });
    }

    const { roomId, start, end } = req.body;

    if (!roomId || !start || !end) {
      return res.status(400).json({
        message:
          "Missing required fields: roomId, start, and end are required.",
      });
    }

    // Determine the user type
    const userType = isCustomer ? "customer" : "admin";

    // Count documents and create new booking
    const count = await Booking.countDocuments({});
    const newId = 1200 + count + 1; // Alternatively, consider using UUID or ObjectId

    const newBooking = new Booking({
      bookingId: newId,
      roomId: roomId,
      email: req.user.email,
      userType: userType, 
      start: start,
      end: end,
    });

    const result = await newBooking.save();
    res.status(201).json({
      message: "Booking created successfully",
      result: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred",
      error: error.message || error,
    });
  }
};
