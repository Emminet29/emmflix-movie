// middleware/isAdmin.js

const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized: No user information" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admin access only" });
  }

  next();
};

module.exports = isAdmin;
