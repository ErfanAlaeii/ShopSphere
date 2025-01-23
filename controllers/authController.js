import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { generateToken } from "../services/authService.js";
import {
  generateRefreshToken,
  verifyRefreshToken,
} from "../services/refreshTokenService.js";
import { createUserSchema } from "../validation/userValidation.js";
import logger from "../utils/logger.js";
import { taskQueue } from "../utils/queue.js";
import sanitize from "mongo-sanitize"; 

export const registerUser = async (req, res) => {
  const { error } = createUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { name, email, password, phone } = req.body;

  try {
    const sanitizedEmail = sanitize(email); 
    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = new User({
      name,
      email: sanitizedEmail,
      password,
      phone,
    });

    await user.save();

    taskQueue.add("clearCache", { cacheKey: `user:${user._id}` });

    const accessToken = generateToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error(`Error registering user: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ error: "Error registering user" });
  }
};

export const loginUser = async (req, res) => {
  const { error } = createUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { email, password } = req.body;

  try {
    logger.info(`Login attempt for email: ${req.body.email}`);
    const sanitizedEmail = sanitize(email); 
    const user = await User.findOne({ email: sanitizedEmail }).select(
      "+password"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = generateToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error(
      `Login failed for email: ${req.body.email} - ${error.message}`
    );
    res.status(500).json({ error: "Error logging in" });
  }
};

export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    const user = await verifyRefreshToken(refreshToken);

    const newAccessToken = generateToken(user._id);

    res.status(200).json({
      message: "New access token generated successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Error refreshing access token:", error.message);
    res.status(401).json({ error: error.message });
  }
};

export const verifyToken = (req, res) => {
  const token = req.body.token;
  const secretKey = process.env.JWT_SECRET;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    return res.status(200).json({
      message: "Token is valid",
      payload: decoded,
    });
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid token", error: err.message });
  }
};

export const logoutUser = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    const result = await RefreshToken.deleteOne({ token: refreshToken });
    if (result.deletedCount === 0) {
      return res.status(400).json({ message: "Invalid refresh token" });
    }

    taskQueue.add("clearCache", {
      cacheKey: `user:refreshToken:${refreshToken}`,
    });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error.message);
    res.status(500).json({ error: "Error logging out user" });
  }
};
