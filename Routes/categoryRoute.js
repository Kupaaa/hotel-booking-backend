import express from 'express'
import { createCategory, deleteCategory } from '../controllers/categoryController.js'

const categoryRoute = express.Router()

categoryRoute.post("/", createCategory)
categoryRoute.delete("/:name", deleteCategory)

export default categoryRoute;