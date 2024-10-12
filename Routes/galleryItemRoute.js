import express from 'express'
import { createGalleryItem, getGalleryItem, deleteGalleryItem, updateGalleryItem } from '../controllers/galleryItemController.js'

const galleryItemRoute = express.Router()

galleryItemRoute.post("/", createGalleryItem)
galleryItemRoute.get("/", getGalleryItem)
galleryItemRoute.delete("/", deleteGalleryItem)
galleryItemRoute.put("/", updateGalleryItem)



export default galleryItemRoute;