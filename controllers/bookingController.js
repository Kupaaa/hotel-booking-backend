import Booking from "../models/booking.js";

// Function to create a new booking in the system
export const createBooking = async (req, res) => {
  try {
    const { roomId, start, end } = req.body;

    if (!roomId || !start || !end) {
      return res.status(400).json({
        message:
          "Missing required fields: roomId, start, and end are required.",
      });
    }

    // Determine the user type
    const userType =
      req.user && req.user.type === "customer" ? "customer" : "admin";

    // Count documents and create new booking
    const count = await Booking.countDocuments({});
    const newId = 1200 + count + 1;

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
