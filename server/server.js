const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(express.json());
const dbConfig = require("./config/dbConfig");

const usersRoute = require("./routes/usersRoute");

const analyzeRoutes = require("./routes/analyzeRoutes");
const historyRoute = require("./routes/historyRoutes");
const blogRoute = require("./routes/blogRoutes");
// Middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

// Routes
app.use("/api/analyze", analyzeRoutes);
app.use("/api/users", usersRoute);
// Add this line to your server.js alongside the other routes:
app.use("/api/history", historyRoute);

app.use("/api/blogs", blogRoute);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});