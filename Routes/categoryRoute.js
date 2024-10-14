import express from 'express'
import { createCategory, deleteCategory, getCategory, getCategoryByName, updateCategory } from '../controllers/categoryController.js'

const categoryRoute = express.Router()

categoryRoute.post("/", createCategory)
categoryRoute.delete("/:name", deleteCategory)
categoryRoute.get("/:name", getCategoryByName)
categoryRoute.get("/", getCategory)
categoryRoute.put("/:name", updateCategory)

export default categoryRoute;