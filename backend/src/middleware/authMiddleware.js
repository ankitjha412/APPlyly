const jwt = require('jsonwebtoken');
const Recruiter = require('../models/Recruiter');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Recruiter.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });

    next();
  } catch {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
