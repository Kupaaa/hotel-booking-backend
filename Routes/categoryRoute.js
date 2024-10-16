import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategory,
  getCategoryByName,
  updateCategory,
} from "../controllers/categoryController.js";
import { checkAdminAuth, checkAuth } from "../services/checkRole.js";

const categoryRoute = express.Router();

// Route to handle operations related to category management
categoryRoute.post("/", checkAuth, checkAdminAuth, createCategory); // Route to create a new category (requires both login and admin privileges)
categoryRoute.delete("/:name", checkAuth, checkAdminAuth, deleteCategory); // Route to delete a category by its name (requires both login and admin privileges)
categoryRoute.get("/:name", getCategoryByName); // Route to get a category by its name (public access, no login required)
categoryRoute.get("/", getCategory); // Route to retrieve all categories (public access, no login required)
categoryRoute.put("/:name", checkAuth, checkAdminAuth, updateCategory); // Route to update a category by its name (requires both login and admin privileges)

export default categoryRoute;
