import express from "express";
import {
  createGalleryItem,
  getGalleryItem,
  deleteGalleryItem,
  updateGalleryItem,
} from "../controllers/galleryItemController.js";
import { checkAdminAuth, checkAuth } from "../services/checkRole.js";

const galleryItemRoute = express.Router();

// Route to handle operations related to gallery item management
galleryItemRoute.post("/", checkAuth, checkAdminAuth, createGalleryItem); // Route to create a new gallery item (requires admin auth)
galleryItemRoute.get("/", getGalleryItem); // Route to get all gallery items
galleryItemRoute.delete("/", checkAuth, checkAdminAuth, deleteGalleryItem); // Route to delete a gallery item (requires admin auth)
galleryItemRoute.put("/", checkAuth, checkAdminAuth, updateGalleryItem); // Route to update an existing gallery item (requires admin auth)

export default galleryItemRoute;
