import express from "express";
import * as userController from "../controllers/usercontroller.js";
import { authorizeRoles, authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authorizeRoles('admin'), userController.createUser);

router.get("/", authorizeRoles('admin'), userController.getAllUsers);

router.patch('/:userId/toggle-active', authenticate, authorizeRoles('admin'), userController.toggleUserActiveStatus);

router.get("/:id", authorizeRoles('admin'), userController.getUserById);

router.put("/:id", authorizeRoles('admin'), userController.updateUser);

router.delete("/:id", authorizeRoles('admin'), userController.deleteUser);



export default router;
