import express from "express";
import {
  createUser,
  loginUser,
  deleteUser,
  updateUser,
  getUser,
  getUserByEmail,
} from "../controllers/userController.js";

const userRouter = express.Router();

// Route to handle operations related to user management
userRouter.post("/", createUser); // Route to create a new user
userRouter.post("/login", loginUser); // Route to log in a user
userRouter.delete("/:email", deleteUser); // Route to delete a user by their email
userRouter.put("/:email", updateUser); // Route to update a user by their email
userRouter.get("/:email", getUserByEmail); // Route to get a user by their email
userRouter.get("/", getUser); // Route to get all users

export default userRouter;
