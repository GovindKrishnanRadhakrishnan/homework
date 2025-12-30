import express from "express";
import {
  createWorkout,
  getAllWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
} from "../Controllers/WorkoutController.js";

const router = express.Router();

// CREATE WORKOUT (Admin)
router.post("/", createWorkout);

// GET ALL WORKOUTS
router.get("/", getAllWorkouts);

// GET WORKOUT BY ID
router.get("/:id", getWorkoutById);

// UPDATE WORKOUT
router.put("/:id", updateWorkout);

// DELETE WORKOUT
router.delete("/:id", deleteWorkout);

export default router;
