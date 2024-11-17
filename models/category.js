import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  features: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  enabled: {
    type: Boolean,
    default: true, // New field to track whether the category is enabled or disabled
  }
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
