import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategory,
  getCategoryByName,
  updateCategory,
} from "../controllers/categoryController.js";

const categoryRoute = express.Router();

// Route to handle operations related to category management
categoryRoute.post("/", createCategory); // Route to create a new category
categoryRoute.delete("/:name", deleteCategory); // Route to delete a category by its name
categoryRoute.get("/:name", getCategoryByName); // Route to get a category by its name
categoryRoute.get("/", getCategory); // Route to retrieve all categories
categoryRoute.put("/:name", updateCategory); // Route to update a category by its name

export default categoryRoute;
