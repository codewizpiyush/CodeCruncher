const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { getAllBlogs, getBlogById, createBlog, deleteBlog } = require("../controllers/blogController");

// Public routes — anyone can read
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);

// Protected routes — only logged-in users
router.post("/", authMiddleware, createBlog);
router.delete("/:id", authMiddleware, deleteBlog);

module.exports = router;