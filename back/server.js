import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const __dirname = path.resolve();

dotenv.config();

const DISK_PATH = path.join(__dirname, "uploads");
const uploadDir = path.join(DISK_PATH, "workouts");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}



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
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());


app.use(
  "/uploads/workouts",
  express.static(path.join(__dirname, "uploads/workouts"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    }
  })
);



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Mongo Error:", err));

/* =========================
   ROUTES
   ========================= */
app.use("/api/customers", customerRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/feedback", feedbackRoutes);

/* =========================
   SERVER START
   ========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
