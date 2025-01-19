import { createOrderSchema } from "../validation/orderValidator.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";

export const createOrder = async (req, res) => {
  
  const { error } = createOrderSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { userId, products, shippingAddress, couponCode } = req.body;

  let totalPrice = 0;
  const productDetails = await Product.find({
    _id: { $in: products.map((p) => p.product) },
  });

  const orderProducts = products.map((product) => {
    const productData = productDetails.find(
      (p) => p._id.toString() === product.product.toString()
    );
    if (productData.stock < product.quantity) {
      throw new Error(`Not enough stock for product: ${productData.name}`);
    }
    totalPrice += productData.price * product.quantity;

    return {
      product: product.product,
      quantity: product.quantity,
      price: productData.price,
    };
  });

  let discount = 0;

  
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode });
    if (coupon) {
      if (coupon.expiresAt > Date.now()) {
        discount = coupon.discount;
      } else {
        throw new Error("Coupon code has expired");
      }
    } else {
      throw new Error("Invalid coupon code");
    }
  }

  const finalPrice = totalPrice - discount;

  try {
    const order = new Order({
      user: userId,
      products: orderProducts,
      totalPrice,
      discount,
      finalPrice,
      shippingAddress,
    });

    await order.save();
    res.status(201).json({
      message: "Order created successfully",
      orderId: order._id,
      finalPrice,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ user: userId })
      .populate("products.product")
      .exec();
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      orderId: order._id,
      status: order.status,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const completeOrderPayment = async (req, res) => {
  const { orderId, paymentDetails } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = "paid";
    order.paymentDetails = paymentDetails;
    await order.save();

    res.status(200).json({
      message: "Order payment completed successfully",
      orderId: order._id,
      status: order.status,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
