import express from "express";
import {
  createUser,
  loginUser,
  deleteUser,
  updateUser,
  getUser,
  getUserByEmail,
  // getUserList,
} from "../controllers/userController.js";
import { checkAdminAuth, checkAuth, isLoggedIn } from "../services/checkRole.js";

const userRouter = express.Router();

// Route to handle user operations
userRouter.post("/", createUser); // Route to create a new user
userRouter.post("/login", loginUser); // Route to log in a user
userRouter.delete("/:userId", checkAuth, checkAdminAuth, deleteUser); // Route to delete a user by their ID (requires admin auth)
userRouter.put("/:userId", checkAuth, checkAdminAuth, updateUser); // Route to update a user by their ID (requires admin auth)
userRouter.get("/:userId", checkAuth, checkAdminAuth, getUserByEmail); // Route to get a user by their ID (requires admin auth)
userRouter.get("/", checkAuth, getUser); // Route to get users 
// userRouter.get("/:list",  checkAuth, checkAdminAuth, getUserList); // Route to get all users (requires admin auth)

export default userRouter;
