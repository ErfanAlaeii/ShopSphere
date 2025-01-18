import User from "../models/user.js";

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


