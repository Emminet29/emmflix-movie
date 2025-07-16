const path = require("path");
const jwt = require("jsonwebtoken");
const User = require(path.join(__dirname, "../models/User"));

const verifyToken = async (req, res, next) => {
  let token;

  // 1. Get token from Authorization header or cookie
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "Authentication required. Please log in.",
    });
  }

  try {
    // 2. Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.userId).select(
      "+role +active"
    );

    // 3. Check if user exists and is active
    if (!currentUser || currentUser.active === false) {
      return res.status(401).json({
        status: "fail",
        message: "Account not found or deactivated.",
      });
    }

    // 4. Optional: Check if password was changed after token was issued
    if (
      typeof currentUser.changedPasswordAfter === "function" &&
      currentUser.changedPasswordAfter(decoded.iat)
    ) {
      return res.status(401).json({
        status: "fail",
        message: "Password changed recently. Please log in again.",
      });
    }

    // 5. Attach user to request and proceed
    req.userId = currentUser._id;
    req.user = currentUser;
    next();
  } catch (err) {
    let message = "Invalid token. Please log in again.";

    if (err.name === "TokenExpiredError") {
      message = "Session expired. Please log in again.";
    } else if (err.name === "JsonWebTokenError") {
      message = "Malformed token detected.";
    }

    res.status(401).json({
      status: "fail",
      message,
    });
  }
};

module.exports = verifyToken;
