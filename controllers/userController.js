import User from "../models/user.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import dotenv from "dotenv";
dotenv.config();

// Function to create a new user
export const createUser = async (req, res) => {
  try {
    const userData = req.body;

    // Convert email to lowercase for consistent storage
    if (userData.email) {
      userData.email = userData.email.toLowerCase();
    }

    // Validate required fields
    if (
      !userData.email ||
      !userData.firstName ||
      !userData.lastName ||
      !userData.phone ||
      !userData.password
    ) {
      return res.status(400).json({
        message:
          "Email, first name, last name, phone, and password are required.",
      });
    }

    // Validate the role field
    if (!userData.role || !["Admin", "Customer"].includes(userData.role)) {
      return res.status(400).json({
        message: "Invalid role. Role must be 'Admin' or 'Customer'.",
      });
    }

    // Explicitly set the type field from the role
    userData.type = userData.role;

    // Check if user already exists by email
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists.",
      });
    }

    // Hash the password
    const passwordHash = await argon2.hash(userData.password);
    userData.password = passwordHash;

    // Create and save the new user
    const newUser = new User({
      ...userData, // Include all fields, including role
    });
    await newUser.save();

    res.status(201).json({
      message: "User created successfully.",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.type, // Include role in the response
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "User creation failed.",
      error: error.message,
    });
  }
};

// Function to handle user login
export const loginUser = async (req, res) => {
  try {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Validate that both email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." }); // Respond with 400 Bad Request if missing
    }

    // Find the user in the database by their email
    const user = await User.findOne({ email });

    // If the user is not found or the password is incorrect, respond with 401 Unauthorized
    if (!user || !(await argon2.verify(user.password, password))) {
      return res.status(401).json({ message: "Invalid email or password." }); // Generic message to avoid exposing sensitive info
    }

    // Create a payload with user details for the JWT token
    const payload = {
      id: user._id, // User's unique ID
      email: user.email, // User's email
      firstName: user.firstName, // User's first name
      lastName: user.lastName, // User's last name
      type: user.type, // User's role or type
    };

    // Generate a JWT token with a 14-hour expiration
    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "14h" });

    // Respond with a success message, the user's details, and the generated token
    res.status(200).json({
      message: "User logged in successfully.",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        type: user.type,
      },
      token, // Include the JWT token in the response
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Login error:", error.message);

    // Respond with a 500 Internal Server Error for unexpected issues
    res.status(500).json({ message: "Login failed.", error: error.message });
  }
};

// Function to delete a user
export const deleteUser = async (req, res) => {
  try {
    const email = req.params.email; // Get email from the route parameter

    // Validate that the email is provided
    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    // Delete the user by email
    const deletedUser = await User.findOneAndDelete({ email }); // Use email to find and delete

    // Check if the user was found and deleted
    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      message: "Failed to delete user.",
      error: error.message,
    });
  }
};

// Function to update a user
export const updateUser = async (req, res) => {
  try {
    const email = req.params.email; // Get email from the URL parameter

    // Validate email
    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    // Fetch the user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Destructure possible fields to update from the request body
    const { firstName, lastName, phone, whatsApp, image, role, disabled } =
      req.body;

    // Backend validation: Check for required fields and valid formats
    if (firstName && typeof firstName !== "string") {
      return res.status(400).json({ message: "Invalid first name." });
    }
    if (lastName && typeof lastName !== "string") {
      return res.status(400).json({ message: "Invalid last name." });
    }
    if (phone && !/^\+?[1-9]\d{1,14}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number." });
    }
    if (whatsApp && !/^\+?[1-9]\d{1,14}$/.test(whatsApp)) {
      return res.status(400).json({ message: "Invalid WhatsApp number." });
    }
    if (role && !["Admin", "Customer"].includes(role)) {
      return res.status(400).json({ message: "Invalid user role." });
    }
    if (disabled !== undefined && typeof disabled !== "boolean") {
      return res
        .status(400)
        .json({ message: "Invalid value for disabled field." });
    }

    // Prepare updates object with fields that need to be updated
    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (phone) updates.phone = phone;
    if (whatsApp) updates.whatsApp = whatsApp;
    if (image) updates.image = image;
    if (role) updates.type = role; // Map 'role' to 'type' to match the backend field name
    if (disabled !== undefined) updates.disabled = disabled;

    // Update the user document with the new fields
    await User.updateOne({ email }, { $set: updates });

    // Fetch the updated user from the database to return in the response
    const updatedUser = await User.findOne({ email });

    // Return success response with updated user
    return res.status(200).json({
      message: "User updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateUser:", error);
    return res.status(500).json({
      message: "User update failed.",
      error: error.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    // Get pageIndex and pageSize from the query params
    const { pageIndex = 0, pageSize = 5 } = req.query;

    // Convert them to integers (in case they come as strings)
    const page = parseInt(pageIndex, 10);
    const size = parseInt(pageSize, 10);

    // Fetch the users from the database with pagination
    const users = await User.find()
      .skip(page * size) // Skip items before the current page
      .limit(size); // Limit the number of items to pageSize

    // Count the total number of users for pagination
    const totalCount = await User.countDocuments();

    // Respond with the paginated users and total count
    return res.status(200).json({
      users: users,
      totalCount: totalCount, // This will be used for pagination in frontend
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to retrieve users.",
      error: error.message,
    });
  }
};

// Function to toggle enabled/disabled status of a user
export const toggleUserStatus = async (req, res) => {
  try {
    const { email } = req.params; // Use email as the unique identifier

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle the disabled status
    user.disabled = !user.disabled;
    await user.save();

    return res.status(200).json({
      message: `User status ${
        user.disabled ? "disabled" : "enabled"
      } successfully`,
      user,
    });
  } catch (error) {
    console.error("Error toggling user status:", error);
    return res.status(500).json({
      message: "An error occurred while updating user status",
      error: error.message,
    });
  }
};

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// blockUser Function
export const blockUser = async (req, res) => {
  try {
    const { email } = req.params; // Use email as the identifier
    const { reason } = req.body; // Optional reason for blocking

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Block the user
    user.blocked = true;
    user.blockReason = reason || "No reason provided";
    user.blockedAt = new Date();

    await user.save();

    return res.status(200).json({
      message: "User blocked successfully",
      user,
    });
  } catch (error) {
    console.error("Error blocking user:", error);
    return res.status(500).json({
      message: "An error occurred while blocking the user",
      error: error.message,
    });
  }
};

// unblockUser Function
export const unblockUser = async (req, res) => {
  try {
    const { email } = req.params; // Use email as the identifier

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Unblock the user
    user.blocked = false;
    user.blockReason = null;
    user.blockedAt = null;

    await user.save();

    return res.status(200).json({
      message: "User unblocked successfully",
      user,
    });
  } catch (error) {
    console.error("Error unblocking user:", error);
    return res.status(500).json({
      message: "An error occurred while unblocking the user",
      error: error.message,
    });
  }
};

// Controller to retrieve details of the currently authenticated user
export const getCurrentUser = async (req, res) => {
  try {
    // Ensure the user information is available in the request object
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized access" }); // Respond with 401 if the user is not authenticated
    }

    // Fetch the user's details from the database using their ID
    // Only select specific fields (firstName, lastName, profileImage, email) to optimize the query
    const user = await User.findById(
      req.user.id,
      "firstName lastName profileImage email"
    );

    // If no user is found, respond with a 404 Not Found error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user's details and a success message
    return res.status(200).json({
      message: "User retrieved successfully",
      user, // Include the retrieved user data in the response
    });
  } catch (error) {
    // Log any unexpected errors to the server console for debugging
    console.error("Error in getCurrentUser:", error.message);

    // Respond with a 500 Internal Server Error for unexpected issues
    return res.status(500).json({
      message: "Failed to retrieve user details",
      error: error.message, // Include the error message for debugging (optional, consider excluding in production)
    });
  }
};
