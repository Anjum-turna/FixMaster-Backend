// src/middleware/adminAuth.js
const adminAuth = (req, res, next) => {
  if (req.user.type !== 'admin') {
    return res.status(403).json({ error: 'Admin access only' });
  }
  next();
};

module.exports = adminAuth;