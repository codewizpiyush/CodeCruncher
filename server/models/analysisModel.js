const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: "js",
    },
    bestTime: {
      type: String,
    },
    averageTime: {
      type: String,
    },
    worstTime: {
      type: String,
    },
    spaceComplexity: {
      type: String,
    },
    calculationExplanation: {
      type: String,
    },
    optimizationSuggestions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const analysisModel = mongoose.model("analyses", analysisSchema);

module.exports = analysisModel;