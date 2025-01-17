import express from "express";
import * as userController from "../controllers/usercontroller.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", userController.createUser);

router.get("/", userController.getAllUsers);

router.get("/:id", userController.getUserById);

router.put("/:id", userController.updateUser);

router.delete("/:id", userController.deleteUser);



export default router;
