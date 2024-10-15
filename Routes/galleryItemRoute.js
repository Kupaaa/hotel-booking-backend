import express from "express";
import {
  createGalleryItem,
  getGalleryItem,
  deleteGalleryItem,
  updateGalleryItem,
} from "../controllers/galleryItemController.js";

const galleryItemRoute = express.Router();

// Route to handle operations related to gallery item management
galleryItemRoute.post("/", createGalleryItem); // Route to create a new gallery item
galleryItemRoute.get("/", getGalleryItem); // Route to get all gallery items
galleryItemRoute.delete("/", deleteGalleryItem); // Route to delete a gallery item
galleryItemRoute.put("/", updateGalleryItem); // Route to update an existing gallery item

export default galleryItemRoute;
