const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken"); // ✅ Added middleware import

// Helper to generate JWT token
const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 */
router.post("/register", async (req, res) => {
  try {
    let { username, email, password, confirmPassword } = req.body;

    username = username?.trim();
    email = email?.toLowerCase().trim();

    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        error: "Missing fields",
        details: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "Validation error",
        details: "Passwords do not match",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(409).json({
        error: "User exists",
        details:
          existingUser.username === username
            ? "Username already taken"
            : "Email already registered",
      });
    }

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("🛑 Registration error:", err);
    res.status(500).json({
      error: "Registration failed",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 */
router.post("/login", async (req, res) => {
  try {
    let { identifier, password } = req.body;

    console.log("📥 Login attempt:", req.body);
    identifier = identifier?.trim();

    if (!identifier || !password) {
      return res.status(400).json({
        error: "Missing credentials",
        details: "Both identifier and password are required",
      });
    }

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
        details: "No user found with these credentials",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid credentials",
        details: "Incorrect password",
      });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("🛑 Login error:", err);
    res.status(500).json({
      error: "Login failed",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

/**
 * @route   GET /api/auth/profile
 * @desc    Get authenticated user profile
 * @access  Private
 */
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error("🔐 Profile fetch error:", err);
    res.status(500).json({
      error: "Failed to fetch user profile",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (clear cookie, optional)
 */
router.post("/logout", (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
