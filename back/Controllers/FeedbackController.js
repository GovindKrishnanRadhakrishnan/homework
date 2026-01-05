import Feedback from "../Models/Feedback.js";
import jwt from "jsonwebtoken"
// CREATE FEEDBACK
export const createFeedback = async (req, res) => {
  try {
    /* =========================
       INLINE AUTH (JWT)
       ========================= */
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }

    const userId = decoded.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID missing in token"
      });
    }

    /* =========================
       CREATE FEEDBACK
       ========================= */
    const feedback = await Feedback.create({
      userId,
      message: req.body.message,
      rating: req.body.rating ?? 5
    });

    res.status(201).json({
      success: true,
      data: feedback
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// GET ALL FEEDBACK
export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("userId", "fullName email");
    res.json({ success: true, data: feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET FEEDBACK BY ID
export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ success: false });

    res.json({ success: true, data: feedback });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE FEEDBACK
export const deleteFeedback = async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Feedback deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
