import { verifyToken } from '../services/authService.js';
import User from '../models/user.js';

export const authenticate = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = verifyToken(token);
    req.user = decoded; 

    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

