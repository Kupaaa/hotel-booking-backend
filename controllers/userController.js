import User from "../models/user.js"
import jwt from 'jsonwebtoken'
import argon2 from 'argon2'
import dotenv from 'dotenv'

dotenv.config();

// Function to create a new user
export const createUser = async (req, res) => {
    try {
        const userData = req.body;

        // Check if password exists
        if(!userData.password) {
            return res.status(400).json({
                message: "Password is required." 
            });
        }

        // Hash the password
        const passwordHash = await argon2.hash(userData.password)
        userData.password = passwordHash

        const newUser = new User(userData)
        await newUser.save()
        res.status(201).json({
            message: "User created successfully."
        });
    } catch (error) {
        res.status(500).json({
            message: "User creation failed.",
            error: error.message
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
                message: "User not found."
            });
        }

        // Verify password
        const isPasswordValid = await argon2.verify(user.password, credential.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials."
            });
        }

        // Payload for JWT
        const payload = {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            type: user.type
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
                type: user.type
            },
            token
        });
    } catch (error) {
        res.status(500).json({
            message: "Login failed.",
            error: error.message
        });
    }
};


// Function to delete a user
export const deleteUser = async (req, res) => {
    try {
        const email = req.body.email;

        if (!email){
            return res.status(400).json({
                message: "Email is required."
            });
        }

        const deleteUser = await User.deleteOne({email:email});

        if (deleteUser.deletedCount === 0){
            return res.status(404).json({
                message: "User not found."
            });
        }

        res.status(200).json({
            message: "User deleted successfully."
        });
    } catch(error){
        res.status(500).json({
            message: "User deletion failed.",
            error: error.message
        });
    }    
};


// Function to update a user
export const updateUser = async (req, res) => {
    try {
        const email = req.body.email;

        if (!email) {
            return res.status(400).json({
                message: "Email is required."
            });
        }

        // Destructure possible fields to update from the request body
        const { firstName, lastName, phone, whatsApp, image, type, disabled } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

         // Update fields only if they are provided in the reques
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phone) user.phone = phone;
        if (whatsApp) user.whatsApp = whatsApp; 
        if (image) user.image = image;
        if (type) user.type = type;
        if (disabled !== undefined) user.disabled = disabled;

        await user.save();

        res.status(200).json({
            message: "User updated successfully.",
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "An error occurred while updating the user.",
            error: error.message 
        });
    }
};


// Function to get user list
export const getUser = async (req, res) => {
    try {
        const usersList = await User.find();

        res.status(200).json({
            message: "User list retrieved successfully.",
            list: usersList
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while retrieving the user list.",
            error: error.message 
        });
    }
};