import User from "../models/user.js";
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export const generateResetPasswordToken = () => {
  return crypto.randomBytes(20).toString('hex');
}

export const sendResetPasswordEmail = async (email, resetToken) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Reset Password',
    html: `<h1>Reset Password</h1>
    <p>Click the link below to reset your password:
    <a href="http://localhost:3000/reset-password/${resetToken}">Reset Password</a>
`
  }

  await transporter.sendMail(mailOptions);
}

export const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

export const getAllUsers = async () => {
  return await User.find();
};

export const toggleUserActiveStatus = async (userId) => {
  return await User.findById(userId);
};



export const getUserById = async (id) => {
  return await User.findById(id);
};

export const updateUser = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

export const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};


