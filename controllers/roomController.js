import Room from "../models/room.js";
import { isAdminValid, isLoggedIn } from "../services/checkRole.js";

// Function to create a new room
export const createRoom = async (req, res) => {
  try {
    // Check if the user is logged in
    if (!isLoggedIn(req)) {
      return res.status(403).json({
        message: "Please login to create a room.",
      });
    }

    // Check if the user has admin privileges
    if (!isAdminValid(req)) {
      return res.status(403).json({
        message: "You don't have permission to create a room.",
      });
    }

    // Extract room data from the request body
    const room = req.body || {};

    // Validate that all required fields are present
    if (
      !room.roomId ||
      !room.category ||
      typeof room.available === "undefined" ||
      !room.maxGuests
    ) {
      return res.status(400).json({
        message:
          "Room must include roomId, category, availability, and maxGuests.",
      });
    }

    // Check if a room with the same roomId already exists in the database
    const existingItem = await Room.findOne({ roomId: room.roomId });
    if (existingItem) {
      return res.status(400).json({
        message: "A room with this ID already exists.",
      });
    }

    // Create a new room instance and save it to the database
    const newRoom = new Room(room);
    await newRoom.save();

    return res.status(200).json({
      message: "Room created successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Room creation failed.",
      error: error.message,
    });
  }
};

// Function to retrieve all rooms
export const getRoom = async (req, res) => {
  try {
    // Fetch all rooms from the database
    const rooms = await Room.find();
    return res.status(200).json({
      rooms: rooms,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to retrieve rooms.",
      error: error.message,
    });
  }
};

// Function to retrieve a room by its ID
export const findRoomById = async (req, res) => {
  try {
    // Use req.params instead of req.parms
    const roomId = req.params.roomId;

    // Check if roomId is provided
    if (!roomId) {
      return res.status(400).json({
        message: "Room ID is required",
      });
    }

    // Correctly find the room by ID
    const room = await Room.findOne({ roomId: roomId });

    // Check if the room exists
    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    // Return the found room
    return res.status(200).json({
      room: room,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to retrieve room",
      error: error.message,
    });
  }
};

// Function to delete a room
export const deleteRoom = async (req, res) => {
  try {
    // Check if the user is logged in
    if (!isLoggedIn(req)) {
      return res.status(403).json({
        message: "Please log in to delete a room.",
      });
    }

    // Check if the logged-in user has admin permissions
    if (!isAdminValid(req)) {
      return res.status(403).json({
        message: "You do not have permission to delete a room.",
      });
    }

    const roomId = req.params.roomId;

    // Check if roomId is provided
    if (!roomId) {
      return res.status(400).json({
        message: "Room ID is required.",
      });
    }

    // Find and delete the room
    const deletedRoom = await Room.findOneAndDelete({ roomId: roomId });

    // Check if the room was found and deleted
    if (!deletedRoom) {
      return res.status(404).json({
        message: "Room not found.",
      });
    }

    // Return success message
    return res.status(200).json({
      message: "Room deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to delete room.",
      error: error.message,
    });
  }
};

// Function to update a room by ID
export const updateRoom = async (req, res) => {
  try {
    // Check if the user is logged in
    if (!isLoggedIn(req)) {
      return res.status(403).json({
        message: "Please log in to update a room.",
      });
    }

    // Check if the user has admin permissions
    if (!isAdminValid(req)) {
      return res.status(403).json({
        message: "You do not have permission to update a room.",
      });
    }

    const roomId = req.params.roomId;

    // Validate roomId
    if (!roomId) {
      return res.status(400).json({
        message: "Room ID is required.",
      });
    }

    // Update the room
    const updatedRoom = await Room.findOneAndUpdate(
      { roomId: roomId },
      req.body,
      { new: true } // Returns the updated document
    );

    // Check if the room was found and updated
    if (!updatedRoom) {
      return res.status(404).json({
        message: "Room not found.",
      });
    }

    // Return success response with updated room
    return res.status(200).json({
      message: "Room updated successfully.",
      room: updatedRoom,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Room update failed.",
      error: error.message,
    });
  }
};

// Function to retrieve rooms based on a specified category
export const getRoomByCategory = async (req, res) => {
  try {
    // Check if the user is logged in
    if (!isLoggedIn(req)) {
      return res.status(403).json({
        message: "Please log in to view rooms by category.",
      });
    }

    // Extract category from the request parameters
    const category = req.params.category;
    console.log(category);

    // Validate the category
    if (!category) {
      return res.status(400).json({
        message: "Category is required.",
      });
    }

    // Fetch rooms by category
    const rooms = await Room.find({ category });

    // Check if rooms were found
    if (rooms.length === 0) {
      return res.status(404).json({
        message: "No rooms found for this category.",
      });
    }

    // Return success response with the list of rooms
    return res.status(200).json({
      message: "Rooms retrieved successfully.",
      rooms,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while retrieving rooms.",
      error: error.message,
    });
  }
};
