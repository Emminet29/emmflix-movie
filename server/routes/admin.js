const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");

// Protected admin route
router.get("/dashboard", verifyToken, isAdmin, (req, res) => {
  res.json({ message: "Admin Dashboard", user: req.user });
});

module.exports = router;
