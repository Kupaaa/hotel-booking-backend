import User from "../models/user.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import dotenv from "dotenv";
import { isLoggedIn, isAdminValid } from "../services/checkRole.js";
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
    // Check if the user is logged in
    if (!isLoggedIn(req)) {
      return res.status(403).json({
        message: "Please log in to delete a user.",
      });
    }

    // Check if the logged-in user has admin permissions
    if (!isAdminValid(req)) {
      return res.status(403).json({
        message: "You do not have permission to delete a user.",
      });
    }

    const email = req.params.email;

    // Validate email
    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    // Delete the user
    const deletedUser = await User.findOneAndDelete({ email: email });

    // Check if the user was found and deleted
    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Return success response
    return res.status(200).json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "User deletion failed.",
      error: error.message,
    });
  }
};

// Function to update a user
export const updateUser = async (req, res) => {
  try {
    // Check if the user is logged in
    if (!isLoggedIn(req)) {
      return res.status(403).json({
        message: "Please log in to update a user.",
      });
    }

    // Check if the user has admin permissions
    if (!isAdminValid(req)) {
      return res.status(403).json({
        message: "You do not have permission to update this user.",
      });
    }

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

// Function to get user list
export const getUser = async (req, res) => {
  try {
    // Check if the user is logged in
    if (!isLoggedIn(req)) {
      return res.status(403).json({
        message: "Please log in to view the user list.",
      });
    }

    // Check if the user has admin permissions
    if (!isAdminValid(req)) {
      return res.status(403).json({
        message: "You do not have permission to view the user list.",
      });
    }

    // Fetch the user list from the database
    const usersList = await User.find();

    // Return success response with the list of users
    return res.status(200).json({
      message: "User list retrieved successfully.",
      list: usersList,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while retrieving the user list.",
      error: error.message,
    });
  }
};

// Function to retrieve a user by their email address
export const getUserByEmail = async (req, res) => {
  try {
    // Check if the user is logged in
    if (!isLoggedIn(req)) {
      return res.status(403).json({
        message: "Please log in to view user details.",
      });
    }

    // Check if the user has admin permissions
    if (!isAdminValid(req)) {
      return res.status(403).json({
        message: "You do not have permission to view user details.",
      });
    }

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
