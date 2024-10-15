import mongoose from "mongoose";

const roomSchema = mongoose.Schema({
  roomId: {
    type: Number,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
    default: true,
  },
  maxGuests: {
    type: Number,
    required: true,
    default: 3,
  },
  specialDescription: {
    type: String,
    default: "",
  },
  photos: [
    {
      type: String,
    },
  ],
  notes: {
    type: String,
    default: "",
  },
});

const Room = mongoose.model("Room", roomSchema);
export default Room;
