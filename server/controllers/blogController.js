const Blog = require("../models/blogModel");

// GET /api/blogs — all blogs, newest first (public)
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .select("title tags authorName createdAt") // omit full content for list view
      .lean();

    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/blogs/:id — single blog full detail (public)
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).lean();
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found." });
    }
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/blogs — create a blog (protected)
const createBlog = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Title is required." });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: "Content is required." });
    }

    // Normalise tags: accept either an array or a comma-separated string
    let parsedTags = [];
    if (Array.isArray(tags)) {
      parsedTags = tags.map((t) => t.trim()).filter(Boolean);
    } else if (typeof tags === "string") {
      parsedTags = tags.split(",").map((t) => t.trim()).filter(Boolean);
    }

    const blog = await Blog.create({
      title: title.trim(),
      content: content.trim(),
      tags: parsedTags,
      authorId: req.user._id,
      authorName: req.user.firstName,
    });

    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/blogs/:id — delete own blog (protected)
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, authorId: req.user._id });
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found or permission denied." });
    }
    await blog.deleteOne();
    res.status(200).json({ success: true, message: "Blog deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllBlogs, getBlogById, createBlog, deleteBlog };