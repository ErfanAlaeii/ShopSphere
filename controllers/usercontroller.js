import * as userService from "../services/userservices.js";
import {
  createUserSchema,
  updateUserSchema,
} from "../validation/userValidation.js";
import User from "../models/user.js";
import client from "../utils/redisClient.js";

export const createUser = async (req, res) => {
  try {
    const { error, value } = createUserSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((err) => err.message),
      });
    }

    const user = await userService.createUser(value);

    client.del("users:*");

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const toggleUserActiveStatus = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await userService.toggleUserActiveStatus(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      message: `User has been ${user.isActive ? "activated" : "deactivated"}`,
      user,
    });
  } catch (error) {
    console.error("Error toggling user active status:", error.message);
    res.status(500).json({ error: "Error toggling user active status" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;
    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);

    const filters = {};
    if (role) filters.role = role;
    if (isActive) filters.isActive = isActive === "true";

    const cacheKey = `users:${JSON.stringify(
      filters
    )}:${pageNumber}:${pageLimit}`;

    client.get(cacheKey, async (err, data) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Redis error" });
      }

      if (data) {
        return res.status(200).json({
          success: true,
          data: JSON.parse(data),
        });
      } else {
        const users = await User.find(filters)
          .skip((pageNumber - 1) * pageLimit)
          .limit(pageLimit)
          .exec();

        const totalUsers = await User.countDocuments(filters);
        const totalPages = Math.ceil(totalUsers / pageLimit);

        client.setex(cacheKey, 3600, JSON.stringify(users));

        return res.status(200).json({
          success: true,
          data: users,
          totalUsers,
          totalPages,
          currentPage: pageNumber,
        });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `user:${id}`;

    client.get(cacheKey, async (err, data) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Redis error" });
      }

      if (data) {
        return res.status(200).json({
          success: true,
          data: JSON.parse(data),
        });
      } else {
        const user = await userService.getUserById(id);
        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }

        client.setex(cacheKey, 3600, JSON.stringify(user));

        return res.status(200).json({
          success: true,
          data: user,
        });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { error, value } = updateUserSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((err) => err.message),
      });
    }

    const user = await userService.updateUser(req.params.id, value);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    client.del(`user:${req.params.id}`);

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    client.del(`user:${req.params.id}`);
    client.del("users:*");

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
