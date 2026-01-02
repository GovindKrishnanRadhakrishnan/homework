import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import fs from "fs";
import path from "path";

const __dirname = path.resolve();

const uploadDir = path.join(__dirname, "uploads/workouts");

// create folders if they don't exist (Render needs this)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

dotenv.config();

import customerRoutes from "./Routes/CustomerRoutes.js";
import feedbackRoutes from "./Routes/FeedbackRoutes.js";
import workoutRoutes from "./Routes/WorkoutRoutes.js";

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://homeworkoutdomain.netlify.app"
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// =========================
// MONGO CONNECTION
// =========================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Mongo Error:", err));
 

// =========================
// ROUTES
// =========================
app.use("/api/customers", customerRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/feedback", feedbackRoutes);


// =========================
// SERVER START
// =========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
