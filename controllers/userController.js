import User from "../models/user.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import dotenv from "dotenv";
dotenv.config();

// Function to create a new user
export const createUser = async (req, res) => {
  try {
    const userData = req.body;

    if (!userData.password) {
      return res.status(400).json({
        message: "Password is required.",
      });
    }

    // Validate required fields
    if (
      !userData.email ||
      !userData.firstName ||
      !userData.lastName ||
      !userData.phone
    ) {
      return res.status(400).json({
        message: "Email, first name, last name, and phone are required.",
      });
    }

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
    const newUser = new User(userData);
    await newUser.save();

    res.status(201).json({
      message: "User created successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "User creation failed.",
      error: error.message,
    });
  }
};

// Function to login a user
export const loginUser = async (req, res) => {
  try {
    const credential = req.body;

    const user = await User.findOne({ email: credential.email });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Verify password
    const isPasswordValid = await argon2.verify(
      user.password,
      credential.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials.",
      });
    }

    // Payload for JWT
    const payload = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      type: user.type,
    };

    // Sign the JWT token
    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "14h" });

    res.json({
      message: "User logged in successfully.",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        type: user.type,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed.",
      error: error.message,
    });
  }
};

// Function to delete a user
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Expecting userId as parameter

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required.",
      });
    }

    // Delete the user by ID
    const deletedUser = await User.findByIdAndDelete(userId); // Use findByIdAndDelete for ObjectId

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
    const { firstName, lastName, phone, whatsApp, image, type, disabled } =
      req.body;

    // Update fields only if they are provided in the request
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (whatsApp) user.whatsApp = whatsApp;
    if (image) user.image = image;
    if (type) user.type = type;
    if (disabled !== undefined) user.disabled = disabled;

    await user.save();

    // Return success response with updated user
    return res.status(200).json({
      message: "User updated successfully.",
      user,
    });
  } catch (error) {
    console.log(error);
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

// Function to retrieve a user by their email address
export const getUserByEmail = async (req, res) => {
  try {
    // Extract the email parameter from the request
    const email = req.params.email;

    // Validate that an email was provided
    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    // Attempt to find the user by their email address
    const user = await User.findOne({ email });

    // Check if the user was found
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Return a success response with the user details
    return res.status(200).json({
      message: "User retrieved successfully.",
      user, // Include the user details in the response
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while retrieving user details.",
      error: error.message,
    });
  }
};

// Function to get user
export async function getUser(req, res) {
  const user = req.body.user;

  if (!user) {
    // Respond with a "not found" message if no user is provided
    return res.status(404).json({
      message: "User not found",
    });
  } else {
    // Respond with the found user
    return res.status(200).json({
      message: "User found",
      user: user,
    });
  }
}

// Function to toggle enabled/disabled status of a user
export const toggleUserStatus = async (req, res) => {
  try {
    const { email } = req.params; // Use email as the unique identifier

    console.log("Email received:", req.params.email);

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
