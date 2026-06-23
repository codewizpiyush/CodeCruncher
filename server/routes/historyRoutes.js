const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { getUserHistory, deleteHistoryItem } = require("../controllers/historyController");

// All history routes require authentication
router.get("/", authMiddleware, getUserHistory);
router.delete("/:id", authMiddleware, deleteHistoryItem);

module.exports = router;