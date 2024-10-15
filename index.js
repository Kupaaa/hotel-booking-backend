import bodyParser from "body-parser";
import express from "express";
import userRoute from "./Routes/usersRoute.js";
import mongoose from "mongoose";
import galleryItemRoute from "./Routes/galleryItemRoute.js";
import categoryRoute from "./Routes/categoryRoute.js";
import dotenv from "dotenv";
import authenticateToken from "./services/authentication.js";
import roomRoute from "./Routes/roomRoute.js";
import bookingRouter from "./Routes/bookingRoute.js";

dotenv.config();

const app = express();

// Database connection string from environment variables
const ConnectionString = process.env.MONGO_URL;

// Connect to the MongoDB database
mongoose
  .connect(ConnectionString)
  .then(() => {
    console.log("connected to the database");
  })
  .catch(() => {
    console.log("connection failed");
  });

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// Use token authentication middleware for all routes
app.use(authenticateToken);

// Define API routes
app.use("/api/users", userRoute); // User management routes
app.use("/api/gallery", galleryItemRoute); // Gallery item management routes
app.use("/api/categories", categoryRoute); // Category management routes
app.use("/api/rooms", roomRoute); // Room management routes
app.use("/api/booking", bookingRouter); // Booking management routes


// Start the server and listen on port 5000
app.listen(5000, (req, res) => {
  console.log("Server is running on port 5000"); // Log server running message
});
