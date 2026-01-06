import Workout from "../Models/Workout.js";
import multer from "multer";
import path from "path";
import fs from "fs";

/* ================================
   MULTER CONFIG (INSIDE CONTROLLER)
================================ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads", "workouts"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    );
  },
});


const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { files: 10 }, // max 10 images
}).array("images", 10);

/* ================================
   CREATE WORKOUT
================================ */
export const createWorkout = (req, res) => {
  upload(req, res, async (err) => {
    if (err)
      return res.status(400).json({ success: false, error: err.message });

    try {
      const imagePaths = req.files
        ? req.files.map(
            (file) => `/uploads/workouts/${file.filename}`
          )
        : [];

      if (imagePaths.length > 10) {
        return res.status(400).json({
          success: false,
          message: "Maximum 10 images allowed",
        });
      }

      const workout = await Workout.create({
        ...req.body,
        images: imagePaths,
      });

      res.status(201).json({ success: true, data: workout });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
};

/* ================================
   GET ALL WORKOUTS
================================ */
export const getAllWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.json({ success: true, data: workouts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ================================
   GET WORKOUT BY ID
================================ */
export const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout)
      return res
        .status(404)
        .json({ success: false, message: "Workout not found" });

    res.json({ success: true, data: workout });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ================================
   UPDATE WORKOUT (ADD MORE IMAGES)
================================ */
export const updateWorkout = (req, res) => {
  upload(req, res, async (err) => {
    if (err)
      return res.status(400).json({ success: false, error: err.message });

    try {
      const workout = await Workout.findById(req.params.id);
      if (!workout)
        return res
          .status(404)
          .json({ success: false, message: "Workout not found" });

      // ===============================
      // 1️⃣ REMOVE SELECTED IMAGES
      // ===============================
      let removeImages = [];
      if (req.body.removeImages) {
        removeImages = Array.isArray(req.body.removeImages)
          ? req.body.removeImages
          : [req.body.removeImages];
      }

    removeImages.forEach((imgPath) => {
  const filePath = path.join(process.cwd(), imgPath);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  workout.images = workout.images.filter((img) => img !== imgPath);
});


      // ===============================
      // 2️⃣ ADD NEW IMAGES
      // ===============================
      const newImages = req.files
        ? req.files.map(
            (file) => `/uploads/workouts/${file.filename}`
          )
        : [];

      if (workout.images.length + newImages.length > 10) {
        return res.status(400).json({
          success: false,
          message: "Maximum 10 images allowed",
        });
      }

      workout.images.push(...newImages);

      // ===============================
      // 3️⃣ UPDATE OTHER FIELDS
      // ===============================
      workout.title = req.body.title ?? workout.title;
      workout.description = req.body.description ?? workout.description;
      workout.reps = req.body.reps ?? workout.reps;
      workout.category = req.body.category ?? workout.category;

      await workout.save();

      res.json({ success: true, data: workout });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
};

/* ================================
   DELETE WORKOUT
================================ */
export const deleteWorkout = async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Workout deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
