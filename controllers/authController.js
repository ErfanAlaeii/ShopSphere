import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { generateToken } from "../services/authService.js";
import {
  generateRefreshToken,
  verifyRefreshToken,
} from "../services/refreshTokenService.js";
import { createUserSchema } from "../validation/userValidation.js";
import RefreshToken from "../models/refreshToken.js";
import logger from "../utils/logger.js";
import { taskQueue } from "../utils/queue.js";
import sanitize from "mongo-sanitize";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import Joi from "joi";

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

    const emailtoken = crypto.randomBytes(32).toString('hex')
    const hashedemailtoken = crypto.createHash('sha256').update(emailtoken).digest('hex')
    user.emailVerificationToken = hashedemailtoken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const verificationLink = `http://localhost:5000/api/auth/verify-email?token=${hashedemailtoken}`;
    await sendEmail(user.email,"Verify Your Email",`Click this link to verify your email: ${verificationLink}`)

    res.status(201).json({ message: "User registered. Please check your email to verify your account." });

    taskQueue.add("clearCache", { cacheKey: `user:${user._id}` });
    

  } catch (error) {
    logger.error(`Error registering user: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ error: "Error registering user" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: "Invalid token" });
    }

    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    if (user.emailVerificationExpires < Date.now()) {
      return res.status(400).json({ error: "Verification token expired" });
    }

    
    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;

    await user.save();

    res.status(200).json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
    res.status(500).json({ error: "Error verifying email" });
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

    if (!user.emailVerified) {
      return res.status(403).json({ error: "Please verify your email before logging in." });
    }

    const isPasswordValid = await user.comparePassword(password);
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
  const schema = Joi.object({
    refreshToken: Joi.string().required().trim(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Invalid refresh token format." });
  }

  const { refreshToken } = req.body;

  try {
    const user = await verifyRefreshToken(refreshToken);
    const newAccessToken = generateToken(user._id);
    res.status(200).json({
      message: "New access token generated successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
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

    if (!result.deletedCount) {
      return res.status(400).json({ message: "Invalid refresh token" });
    }

    taskQueue.add("clearCache", {
      cacheKey: `user:refreshToken:${refreshToken}`,
    });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    logger.error(`Error logging out user: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ error: "Error logging out user" });
  }
};

