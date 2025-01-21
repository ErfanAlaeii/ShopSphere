import express from "express";
import {
  initiatePayment,
  confirmPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/initiate", initiatePayment); 
router.get("/verify", confirmPayment); 

export default router;
