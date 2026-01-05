import Feedback from "../Models/Feedback.js";

// CREATE FEEDBACK
export const createFeedback = async (req, res) => {
  try {
    // Prefer userId from auth (Android, logged-in web)
    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const feedback = await Feedback.create({
      userId,
      message: req.body.message,
      rating: req.body.rating ?? 5
    });

    res.status(201).json({ success: true, data: feedback });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
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
