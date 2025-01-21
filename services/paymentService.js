import ZarinpalCheckout from "zarinpal-checkout";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";


const zarinpal = ZarinpalCheckout.create(process.env.ZARINPAL_MERCHANT_ID, true); 

export const createPayment = async (orderId, userId) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  const amount = order.finalPrice;
  const callbackURL = process.env.ZARINPAL_CALLBACK_URL;

  const response = await zarinpal.PaymentRequest({
    Amount: amount, 
    CallbackURL: callbackURL,
    Description: `Payment for order${orderId}`,
  });

  if (response.status !== 100) throw new Error("Error in payment request");

  const payment = await Payment.create({
    user: userId,
    order: orderId,
    amount,
    authority: response.authority,
    status: "pending",
  });

  return response.url; 
};

export const verifyPayment = async (authority) => {
  const payment = await Payment.findOne({ authority });
  if (!payment) throw new Error("Payment not found");

  const response = await zarinpal.PaymentVerification({
    Amount: payment.amount,
    Authority: authority,
  });

  if (response.status === 100) {
    payment.status = "success";
    await payment.save();

    const order = await Order.findById(payment.order);
    order.status = "paid";
    await order.save();

    return { success: true, payment, order };
  } else {
    payment.status = "failed";
    await payment.save();
    throw new Error("Payment verification failed");
  }
};
