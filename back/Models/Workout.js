import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    // 🔥 multiple images (max 10 handled in controller)
    images: {
      type: [String], // array of image paths
      default: [],
    },

    reps: { type: String },
    category: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Workout", workoutSchema);
