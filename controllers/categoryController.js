import Category from "../models/category.js"; 
import { isAdminValid, isLoggedIn } from "../services/checkRole.js";

// Function to create a new category
export const createCategory = async (req, res) => {
    try {
        // Check if the user is logged in
        if (!isLoggedIn(req)) {
            return res.status(403).json({
                message: "Please login to create a category." 
            });
        }

        // Check if the logged-in user has admin permissions
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

// Function to delete category
export const deleteCategory = async (req, res) => {
    try {
        // Check if the user is logged in
        if (!isLoggedIn(req)) {
            return res.status(403).json({
                message: "Please log in to delete a category." 
            });
        }

        // Check if the logged-in user has admin permissions
        if (!isAdminValid(req)) {
            return res.status(403).json({
                message: "You do not have permission to delete a category." 
            });
        }

        const name = req.params.name;

        // Validate that the category name is provided
        if (!name) {
            return res.status(400).json({
                message: "Category item name is required." 
            });
        }

        // Attempt to delete the category by its name
        const deletedCategory = await Category.findOneAndDelete({ name: name });

        // Check if the category was found and deleted
        if (!deletedCategory) {
            return res.status(404).json({
                message: "Category not found." // Not found error
            });
        }

        // Return success response if category is deleted
        return res.status(200).json({
            message: "Category deleted successfully." 
        });

    } catch (error) {
        console.error("Error deleting category:", error); 
        return res.status(500).json({
            message: "Category deletion failed.", 
            error: error.message 
        });
    }
};


// Function to get all categories
export const getCategory = async (req, res) => {
    try {
        // Fetch all categories from the database
        const categories = await Category.find(); 
        
        // Respond with the list of categories
        return res.status(200).json({
            categories: categories 
        });

    } catch (error) {
        console.error("Error fetching categories:", error); 
        return res.status(500).json({
            message: "Failed to get categories",
            error: error.message,
        });
    }
}


// Function to get a category by name
export const getCategoryByName = async (req, res) => {
    try {
        const name = req.params.name; 
        
        // Check if the category name is provided
        if (!name) {
            return res.status(400).json({
                message: "Category name is required."
            });
        }

        // Find the category by its name
        const category = await Category.findOne({ name: name }); 

        // Check if the category was found
        if (!category) {
            return res.status(404).json({
                message: "Category not found."
            });
        }

        // Respond with the found category
        return res.status(200).json({
            category: category
        });

    } catch (error) {
        console.error("Error fetching category:", error); 
        return res.status(500).json({
            message: "Failed to retrieve category.",
            error: error.message
        });
    }
};
