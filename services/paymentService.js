import ZarinpalCheckout from "zarinpal-checkout";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import { CustomError } from "../utils/errors.js";

const zarinpal = ZarinpalCheckout.create(
  process.env.ZARINPAL_MERCHANT_ID,
  true
);

export const createPayment = async (orderId, userId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new CustomError(404, "Order not found");
  }

  if (order.status === "paid") {
    throw new CustomError(400, "Order is already paid");
  }

  const amount = order.finalPrice;
  const callbackURL = `${process.env.ZARINPAL_CALLBACK_URL}?orderId=${orderId}`;

  try {
    const response = await zarinpal.PaymentRequest({
      Amount: amount,
      CallbackURL: callbackURL,
      Description: `Payment for order ${orderId}`,
    });

    if (response.status !== 100) {
      throw new CustomError(400, "Failed to initialize payment with Zarinpal");
    }

    const payment = await Payment.create({
      user: userId,
      order: orderId,
      amount,
      authority: response.authority,
      status: "pending",
      callbackURL,
    });

    return {
      paymentUrl: response.url,
      authority: response.authority,
      payment: payment,
    };
  } catch (error) {
    if (error instanceof CustomError) throw error;
    throw new CustomError(500, "Error processing payment request");
  }
};


export const verifyPayment = async (authority, amount) => {
  try {
    console.log('Verifying payment with:', { authority, amount });
    
    const payment = await Payment.findOne({ authority });
    if (!payment) {
      throw new CustomError(404, "Payment not found");
    }
    console.log('Found payment:', JSON.stringify(payment, null, 2));

    const verificationData = {
      Amount: parseInt(amount),
      Authority: authority,
    };
    console.log('Sending verification request:', verificationData);

    try {
      const response = await zarinpal.PaymentVerification(verificationData);
      console.log('Raw Zarinpal response:', response);
      
      if (response.status === 100) {
        payment.status = "success";
        await payment.save();
        console.log('Payment marked as success');

        const order = await Order.findById(payment.order);
        if (order) {
          order.status = "paid";
          await order.save();
          console.log('Order marked as paid');
        }

        return { success: true, refId: response.RefID, payment, order };
      }

      payment.status = "failed";
      await payment.save();
      console.log('Payment marked as failed');
      
      throw new CustomError(400, `Zarinpal Error: ${response.status}`);
    } catch (zarinpalError) {
      console.error('Zarinpal API Error:', zarinpalError);
      throw new CustomError(400, `Zarinpal API Error: ${zarinpalError.message}`);
    }
  } catch (err) {
    console.error('Verification Error:', {
      message: err.message,
      stack: err.stack
    });
    throw err;
  }
};

export const getPaymentByAuthority = async (authority) => {
  const payment = await Payment.findOne({ authority })
    .populate("user", "name email")
    .populate("order");

  if (!payment) {
    throw new CustomError(404, "Payment not found");
  }

  return payment;
};

export const getPaymentsByUser = async (userId) => {
  return await Payment.find({ user: userId })
    .populate("order")
    .sort({ createdAt: -1 });
};
