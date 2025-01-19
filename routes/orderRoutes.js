import express from "express";
import {
    createOrder,
    getUserOrders,
    updateOrderStatus,
    getAllOrders,
    deleteOrder,
    completeOrderPayment,
} from "../controllers/orderController.js";

const router = express.Router();


router.post("/create", createOrder);


router.get("/:orderId", getUserOrders);


router.get("/", getAllOrders);


router.delete("/:orderId", deleteOrder);


router.put("/status", updateOrderStatus);


router.put("/payment/:orderId", completeOrderPayment);


export default router;
