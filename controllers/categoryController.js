import Category from "../models/category.js"; 
import { isAdminValid, isLoggedIn } from "../services/checkRole.js";

export const createCategory = async (req, res) => {
    try {
        if (!isLoggedIn(req)) {
            return res.status(403).json({
                message: "Please login to create a category."
            });
        }

        if (!isAdminValid(req)) {
            return res.status(403).json({
                message: "You don't have permission to create a category."
            });
        }
        
        const category = req.body || {};

        // Validate required fields
        if (!category.name || !category.price || !category.features || !category.description || !category.image) {
            return res.status(400).json({
                message: "Category must include name, price, features, description, and image."
            });
        }

        // Check if a category with the same name already exists
        const existingItem = await Category.findOne({ name: category.name });
        if (existingItem) {
            return res.status(400).json({
                message: "A category with this name already exists."
            });
        }

        // Create and save the new category
        const newCategory = new Category(category);
        await newCategory.save();

        return res.status(200).json({
            message: "Category created successfully."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Category creation failed.",
            error: error.message
        });
    }
};
