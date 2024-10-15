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

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.delete("/:email", deleteUser);
userRouter.put("/:email", updateUser);
userRouter.get("/:email", getUserByEmail);
userRouter.get("/", getUser);

export default userRouter;
