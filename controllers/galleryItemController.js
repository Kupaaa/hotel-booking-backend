import GalleryItem from "../models/galleryItem.js";

// Function to create a new gallery item
export const createGalleryItem = async (req, res) => {
  try {
    const { name, image, description } = req.body;

    // Validate GalleryItem structure
    if (!name || !image || !description) {
      return res.status(400).json({
        message: "Gallery item must include name, image, and description.",
      });
    }

    // Check if the gallery item with the same name already exists
    const existingItem = await GalleryItem.findOne({ name });
    if (existingItem) {
      return res.status(400).json({
        message: "A gallery item with this name already exists.",
      });
    }

    // Create a new gallery item
    const newGalleryItem = new GalleryItem({
      name,
      image,
      description,
    });
    await newGalleryItem.save();

    // Respond with a success message
    return res.status(201).json({
      message: "Gallery item created successfully.",
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({
      message: "Gallery item creation failed.",
      error: error.message,
    });
  }
};

// Function to get all gallery items
export const getGalleryItem = async (req, res) => {
  try {
    // Retrieve all gallery items from the database
    const list = await GalleryItem.find();

    // Check if the list is empty
    if (list.length === 0) {
      return res.status(404).json({
        message: "No gallery items found.",
      });
    }

    // Respond with the list of gallery items
    res.status(200).json({
      items: list,
    });
  } catch (err) {
    // Handle errors during retrieval
    res.status(500).json({
      message: "Failed to retrieve gallery items.",
      error: err.message,
    });
  }
};

export const deleteGalleryItem = async (req, res) => {
  try {
    // Get the gallery item name from the route parameters (not the body)
    const galleryItemName = req.params.name;

    // Validate that the gallery item name is provided
    if (!galleryItemName) {
      return res.status(400).json({
        message: "Gallery item name is required.",
      });
    }

    // Attempt to delete the gallery item by its name
    const deleteResult = await GalleryItem.deleteOne({ name: galleryItemName });

    // Check if any item was deleted
    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({
        message: "Gallery item not found.",
      });
    }

    // Respond with a success message
    return res.status(200).json({
      message: "Gallery item deleted successfully.",
    });
  } catch (error) {
    console.log(error); // Log the error for debugging
    return res.status(500).json({
      message: "Gallery item deletion failed.",
      error: error.message,
    });
  }
};


// Function to update a gallery item
export const updateGalleryItem = async (req, res) => {
  try {
    // Get the gallery item name from the request body
    const galleryItemName = req.body.name;

    // Validate that the gallery item name is provided
    if (!galleryItemName) {
      return res.status(400).json({
        message: "Gallery item name is required.",
      });
    }

    // Find the gallery item by name
    const galleryItem = await GalleryItem.findOne({ name: galleryItemName });

    // Check if the gallery item exists
    if (!galleryItem) {
      return res.status(404).json({
        message: "Gallery item not found.",
      });
    }

    // Destructure possible fields to update from the request body
    const { name, image, description } = req.body;

    // Update fields only if they are provided in the request
    if (name) galleryItem.name = name;
    if (image) galleryItem.image = image;
    if (description) galleryItem.description = description;

    // Save the updated gallery item instance
    await galleryItem.save();

    // Respond with a success message and the updated gallery item
    res.status(200).json({
      message: "Gallery item updated successfully.",
      galleryItem,
    });
  } catch (error) {
    console.log(error); // Log the error for debugging
    return res.status(500).json({
      message: "Gallery item update failed.",
      error: error.message,
    });
  }
};
