import { verifyToken } from '../services/authService.js';
import User from '../models/user.js';

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = verifyToken(token); // بررسی و دیکد توکن
    req.user = decoded
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = { id: user._id, role: user.role }; // ذخیره نقش در req.user
    next(); // ادامه به middleware بعدی
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};


export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};


