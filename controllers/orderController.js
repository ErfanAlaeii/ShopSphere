import { createOrderSchema } from "../validation/orderValidator.js";
import Order from "../models/Order.js";
import { Product } from "../models/products.js";
import Coupon from "../models/Coupon.js";
import createHttpError from "http-errors";

export const createOrder = async (req, res, next) => {
  try {
    const { error } = createOrderSchema.validate(req.body);
    if (error) {
      throw createHttpError(400, error.details[0].message);
    }

    const { userId, products, shippingAddress, couponCode, paymentDetails } =
      req.body;

    let totalPrice = 0;
    const productDetails = await Product.find({
      _id: { $in: products.map((p) => p.product) },
    });

    const orderProducts = products.map((product) => {
      const productData = productDetails.find(
        (p) => p._id.toString() === product.product.toString()
      );
      if (productData.stock < product.quantity) {
        throw createHttpError(
          400,
          `Not enough stock for product: ${productData.name}`
        );
      }
      totalPrice += productData.price * product.quantity;

      return {
        product: product.product,
        quantity: product.quantity,
        price: productData.price,
      };
    });

    let discount = 0;

    const couponCodeRegex = /^[A-Z0-9]{6,12}$/;

    if (couponCode) {
      if (!couponCodeRegex.test(couponCode)) {
        throw createHttpError(400, "Invalid coupon code format.");
      }

      const sanitizedCouponCode = couponCode.trim();

      const coupon = await Coupon.findOne({
        code: sanitizedCouponCode,
      }).exec();

      if (coupon) {
        if (coupon.expiresAt > Date.now()) {
          discount = coupon.discount;
        } else {
          throw createHttpError(400, "Coupon code has expired.");
        }
      } else {
        throw createHttpError(404, "Coupon code not found.");
      }
    }

    const finalPrice = totalPrice - discount;

    const order = new Order({
      user: userId,
      products: orderProducts,
      totalPrice,
      discount,
      finalPrice,
      shippingAddress,
      paymentStatus: "unpaid",
      paymentDetails,
    });

    await order.save();
    res.status(201).json({
      message: "Order created successfully",
      orderId: order._id,
      finalPrice,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ orders });
  } catch (error) {
    next(error);
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .populate("products.product")
      .exec();
    res.status(200).json({ orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      throw createHttpError(404, "Order not found");
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      orderId: order._id,
      status: order.status,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      throw createHttpError(404, "Order not found");
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const completeOrderPayment = async (req, res, next) => {
  try {
    const { orderId, paymentDetails } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      throw createHttpError(404, "Order not found");
    }

    order.status = "paid";
    order.paymentDetails = paymentDetails;
    order.paymentStatus = "paid";
    await order.save();

    res.status(200).json({
      message: "Order payment completed successfully",
      orderId: order._id,
      status: order.status,
    });
  } catch (error) {
    next(error);
  }
};
