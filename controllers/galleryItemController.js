import GalleryItem from "../models/galleryItem.js";

// Function to create a gallery item
export const createGalleryItem = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(403).json({
                message: "Please login to create a gallery item."
            });
        }

        if (user.type !== "admin") {
            return res.status(403).json({
                message: "You don't have permission to create a gallery item."
            });
        }

        // Validate GalleryItem structure
        const galleryItem = req.body.GalleryItem;
        if (!galleryItem || !galleryItem.name || !galleryItem.image || !galleryItem.description) {
            return res.status(400).json({
                message: "Gallery item must include name, image, and description."
            });
        }

        // Create a new gallery item
        const newGalleryItem = new GalleryItem(galleryItem);
        await newGalleryItem.save();

        return res.status(201).json({
            message: "Gallery item created successfully."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Gallery item creation failed.",
            error: error.message
        });
    }
};

// Function to retrieve gallery items
export const getGalleryItem = async (req, res) => {
    try {
        const list = await GalleryItem.find();
        res.status(200).json({
            list: list,
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to retrieve gallery items.",
            error: err.message,
        });
    }
};


// Function to delete a gallery item
export const deleteGalleryItem = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(403).json({
                message: "Please log in to delete a gallery item."
            });
        }

        if (user.type !== "admin") {
            return res.status(403).json({
                message: "You do not have permission to delete a gallery item."
            });
        }

        const galleryItemName = req.body.name;

        if (!galleryItemName) {
            return res.status(400).json({
                message: "Gallery item name is required."
            });
        }

        // Attempt to delete the gallery item by its name
        const deleteResult = await GalleryItem.deleteOne({ name: galleryItemName });

        if (deleteResult.deletedCount === 0) {
            return res.status(404).json({
                message: "Gallery item not found."
            });
        }

        return res.status(200).json({
            message: "Gallery item deleted successfully." 
        });
    } catch (error) {
        console.log(error); 
        return res.status(500).json({
            message: "Gallery item deletion failed.",
            error: error.message
        });
    }
};

// Function to update a gallery item
export const updateGalleryItem = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(403).json({
                message: "Please log in to update a gallery item."
            });
        }

        if (user.type !== "admin") {
            return res.status(403).json({
                message: "You do not have permission to update a gallery item."
            });
        }

        const galleryItemName = req.body.name;

        if (!galleryItemName) {
            return res.status(400).json({
                message: "Gallery item name is required."
            });
        }

        // Find the gallery item by name
        const galleryItem = await GalleryItem.findOne({ name: galleryItemName });

        if (!galleryItem) {
            return res.status(404).json({
                message: "Gallery item not found."
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

        res.status(200).json({
            message: "Gallery item updated successfully.",
            galleryItem 
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Gallery item update failed.",
            error: error.message
        });
    }
};
