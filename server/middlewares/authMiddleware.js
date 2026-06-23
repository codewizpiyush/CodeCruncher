const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).send({ message: "Unauthorized", success: false });
    }

    req.user = user; // Attach full user object here
    next();
  } catch (error) {
    return res.status(401).send({ message: "Authorization Failed", success: false });
  }
};