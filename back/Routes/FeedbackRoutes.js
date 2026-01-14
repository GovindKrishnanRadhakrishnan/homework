import express from "express";
import {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  deleteFeedback,submitFeedback
} from "../Controllers/FeedbackController.js";

const router = express.Router();

// CREATE FEEDBACK
router.post("/", createFeedback);

// GET ALL FEEDBACK
router.get("/", getAllFeedback);

// GET FEEDBACK BY ID
router.get("/:id", getFeedbackById);

// DELETE FEEDBACK
router.delete("/:id", deleteFeedback);
router.post("/", submitFeedback);


export default router;

