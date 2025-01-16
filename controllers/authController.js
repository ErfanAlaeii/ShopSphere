import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { generateToken } from '../services/authService.js';

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
   
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

   
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    
    const token = generateToken(user._id);

    
    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(500).json({ error: 'Error logging in' });
  }
};


export const verifyToken = (req, res) => {
  const token = req.body.token; 
  const secretKey = process.env.JWT_SECRET;

  if (!token) {
      return res.status(400).json({ message: 'Token is required' });
  }

  try {
      
      const decoded = jwt.verify(token, secretKey);
      return res.status(200).json({
          message: 'Token is valid',
          payload: decoded, 
      });
  } catch (err) {
      return res.status(401).json({ message: 'Invalid token', error: err.message });
  }
};