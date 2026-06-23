const Analysis = require("../models/analysisModel");

// GET /api/history — fetch all analyses for the logged-in user, newest first
const getUserHistory = async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 }) // newest first
      .lean();

    res.status(200).json({
      success: true,
      data: analyses,
    });
  } catch (error) {
    console.error("getUserHistory error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch history.",
    });
  }
};

// DELETE /api/history/:id — delete a single history entry (owned by user)
const deleteHistoryItem = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id, // ensures users can only delete their own records
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Record not found or you don't have permission to delete it.",
      });
    }

    await analysis.deleteOne();

    res.status(200).json({
      success: true,
      message: "History item deleted successfully.",
    });
  } catch (error) {
    console.error("deleteHistoryItem error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete history item.",
    });
  }
};

module.exports = { getUserHistory, deleteHistoryItem };