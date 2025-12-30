import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    message: { type: String, required: true },
    rating: { type: Number, default: 5 },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
