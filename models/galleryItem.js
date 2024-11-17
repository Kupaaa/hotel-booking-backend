import mongoose from "mongoose";

const galleryItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  enabled: {
    type: Boolean,
    default: true, // You can set this to true or false depending on your needs
  },
}, { timestamps: true });  // Optional: Adds createdAt and updatedAt fields automatically


const GalleryItem = mongoose.model("GalleryItem", galleryItemSchema);
export default GalleryItem;
