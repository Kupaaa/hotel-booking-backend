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

// Function to delete a booking in the system
export const deleteBookingById = async (req, res) => {
  try {
    // Check if the user is logged in
    if (!isLoggedIn(req)) {
      return res.status(403).json({
        message: "Please log in to delete the booking.",
      });
    }

    // Check if the user is an admin
    if (!isAdminValid(req)) {
      return res.status(403).json({
        message: "You do not have permission to delete this booking.",
      });
    }

    // Get booking ID from request parameters
    const bookingId = req.params.bookingId;
    if (!bookingId) {
      return res.status(400).json({
        message: "Booking ID is required.",
      });
    }

    // Try to find and delete the booking
    const deleteBooking = await Booking.findOneAndDelete({
      bookingId: bookingId,
    });

    // If booking not found
    if (!deleteBooking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    // Success response
    return res.status(200).json({
      message: "Booking deleted successfully.",
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({
      message: "Error deleting the booking.",
      error: error.message, // Include error message for more detail
    });
  }
};

// Function to retrieve the list of all bookings
export const getBooking = async (req, res) => {
  try {
    // Check if the user is logged in
    if (!isLoggedIn(req)) {
      return res.status(403).json({
        message: "Please log in to access bookings.",
      });
    }

    // Check if the user has admin privileges
    if (!isAdminValid(req)) {
      return res.status(403).json({
        message: "You do not have permission to retrieve bookings.",
      });
    }

    // Retrieve the list of bookings
    const bookingList = await Booking.find();

    // Return the list of bookings
    return res.status(200).json({
      message: "Booking list retrieved successfully.",
      lists: bookingList,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to retrieve bookings.",
      error: error.message,
    });
  }
};

// Function to retrieve booking by ID
export const getBookingById = async (req, res) => {
  try {
    // Check if the user is logged in
    if (!isLoggedIn(req)) {
      return res.status(403).json({
        message: "Please log in to view booking.",
      });
    }

    // Check if the user has admin privileges
    if (!isAdminValid(req)) {
      return res.status(403).json({
        message: "You do not have permission to view this booking.",
      });
    }

    const bookingId = req.params.bookingId;

    if (!bookingId) {
      return res.status(400).json({
        message: "Booking ID is required.",
      });
    }

    // Find the booking by bookingId
    const booking = await Booking.findOne({ bookingId: bookingId });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    return res.status(200).json({
      message: "Booking retrieved successfully.",
      booking: booking,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to retrieve booking.",
      error: error.message,
    });
  }
};

// Function to update booking by ID
export const updateBookingById = async (req, res) => {
  try {
    // Check if the user is logged in
    if (!isLoggedIn(req)) {
      return res.status(403).json({
        message: "Please log in to update a booking.",
      });
    }

    // Check if the user has admin privileges
    if (!isAdminValid(req)) {
      return res.status(403).json({
        message: "You do not have permission to update this booking.",
      });
    }

    const bookingId = req.params.bookingId;

    // Ensure bookingId is provided
    if (!bookingId) {
      return res.status(400).json({
        message: "Booking ID is required.",
      });
    }

    // Create a copy of the request body without the bookingId
    const { bookingId: _, ...updateData } = req.body;

    // Update the booking while excluding bookingId from being updated
    const updateBooking = await Booking.findOneAndUpdate(
      { bookingId: bookingId }, // Find by bookingId
      updateData, // Use the updated data (excluding bookingId)
      { new: true } // Return the updated document
    );

    // Check if the booking was found and updated
    if (!updateBooking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    // Return success response with updated booking details
    return res.status(200).json({
      message: "Booking updated successfully.",
      booking: updateBooking,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to update the booking.",
      error: error.message,
    });
  }
};
