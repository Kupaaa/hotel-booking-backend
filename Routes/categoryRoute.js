import express from 'express'
import { createCategory } from '../controllers/categoryController.js'

const categoryRoute = express.Router()

categoryRoute.post("/", createCategory)

export default categoryRoute;