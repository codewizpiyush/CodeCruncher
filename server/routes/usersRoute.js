const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

// user registration

router.post("/register", async (req, res) => {
  try {
    // check if user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    // create new user
    const newUser = new User(req.body);
    await newUser.save();
    res.send({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// user login

router.post("/login", async (req, res) => {
  try {
    // check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send({ message: "User does not exist", success: false });
    }

    // 2. Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).send({ message: "Your account is blocked. Please contact Admin.", success: false });
    }

    // check password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).send({ message: "Invalid password", success: false });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // 5. Success response
    res.status(200).send({
     message: "User logged in successfully",
     success: true,
     data: token,
    });
    
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// get user info

router.post("/get-user-info", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    res.send({
      message: "User info fetched successfully",
      success: true,
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// Get all users
router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// Update user's block/unblock status
router.post("/update-user-status", authMiddleware, async (req, res) => {
  try {
    const { userId, isBlocked } = req.body;

    if (req.user._id.toString() === userId) {
      return res.status(400).send({
        success: false,
        message: "You cannot block/unblock yourself",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    user.isBlocked = isBlocked;
    await user.save();

    res.status(200).send({
      success: true,
      message: `User has been ${isBlocked ? "blocked" : "unblocked"} successfully`,
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
