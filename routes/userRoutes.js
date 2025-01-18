import express from "express";
import * as userController from "../controllers/usercontroller.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authorizeRoles('admin'), userController.createUser);

router.get("/", authorizeRoles('admin'), userController.getAllUsers);

router.get("/:id", authorizeRoles('admin'), userController.getUserById);

router.put("/:id", authorizeRoles('admin'), userController.updateUser);

router.delete("/:id", authorizeRoles('admin'), userController.deleteUser);



export default router;
