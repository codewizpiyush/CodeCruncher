const express = require("express");
const router = express.Router();
const { analyzeCode } = require("../controllers/analyzeController");
const authMiddleware = require("../middlewares/authMiddleware");

// authMiddleware attaches req.user if token is valid.
// We use it here so the controller can save results against the logged-in user.
router.post("/",authMiddleware, analyzeCode);

module.exports = router;