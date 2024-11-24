import express from "express";
import {
  createUser,
  loginUser,
  deleteUser,
  updateUser,
  getUsers,
  toggleUserStatus,
  blockUser,
  unblockUser,
  getCurrentUser,
} from "../controllers/userController.js";
import {
  checkAdminAuth,
  checkAuth,
  isLoggedIn,
} from "../services/checkRole.js";
import authMiddleware from "../services/authMiddleware.js";

const userRouter = express.Router();

// Route to handle user operations
userRouter.post("/", createUser); // Route to create a new user
userRouter.post("/login", loginUser); // Route to log in a user
userRouter.delete("/:email", checkAuth, checkAdminAuth, deleteUser); // Route to delete a user by their ID (requires admin auth)
userRouter.put("/:userId", checkAuth, checkAdminAuth, updateUser); // Route to update a user by their ID (requires admin auth)
userRouter.get("/", checkAuth, checkAdminAuth, getUsers); // Route to get all users (requires admin auth)

// Route to retrieve the currently authenticated user's details
userRouter.get("/me", checkAuth, authMiddleware, getCurrentUser);

// Toggle enabled/disabled status of a user
userRouter.patch("/:email/toggle", checkAuth, checkAdminAuth, toggleUserStatus); // Toggle a user's enabled/disabled status (requires admin auth)

// Optional: Routes for blocking/unblocking users
userRouter.patch("/:email/block", checkAuth, checkAdminAuth, blockUser); // Block a user by email
userRouter.patch("/:email/unblock", checkAuth, checkAdminAuth, unblockUser); // Unblock a user by email

export default userRouter;
