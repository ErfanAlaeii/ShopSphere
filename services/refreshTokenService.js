import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import RefreshToken from '../models/refreshToken.js';

dotenv.config();

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const REFRESH_TOKEN_EXPIRES_IN = '7d'; 

export const generateRefreshToken = async (userId) => {
  const token = jwt.sign({ id: userId }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); 


  await RefreshToken.create({
    token,
    user: userId,
    expiresAt,
  });

  return token;
};

export const verifyRefreshToken = async (token) => {
  try {
   
    jwt.verify(token, JWT_REFRESH_SECRET);

    const storedToken = await RefreshToken.findOne({ token }).populate('user');

    if (!storedToken || new Date() > storedToken.expiresAt) {
      throw new Error('Invalid or expired refresh token');
    }

    return storedToken.user;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};
