import mongoose from "mongoose";
import validator from "validator";

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email address"],
  },
  emailVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v); // Example for a 10-digit phone number
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  whatsApp: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\+[1-9]\d{1,14}$/.test(v); // International phone number format
      },
      message: (props) => `${props.value} is not a valid WhatsApp number!`,
    },
  },

  type: {
    type: String,
    required: true,
    enum: ["Admin", "Customer"], // Role-based restriction
    default: "Customer", // Default to Customer
  },
  disabled: {
    type: Boolean,
    required: true,
    default: false, // Indicates if the account is inactive (voluntarily or administratively)
  },
  blocked: {
    type: Boolean,
    required: true,
    default: false, // Indicates if the user is blocked due to spam or abuse
  },
  blockReason: {
    type: String, // Stores the reason for blocking the user
    default: null,
  },
  blockedAt: {
    type: Date, // Timestamp of when the user was blocked
    default: null,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
