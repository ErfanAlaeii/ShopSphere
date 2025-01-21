import { createPayment, verifyPayment } from "../services/paymentService.js";
import {
  createPaymentSchema,
  verifyPaymentSchema,
} from "../validation/paymentValidation.js";

export const initiatePayment = async (req, res) => {
  try {
    const { error } = createPaymentSchema.validate(req.body);
    if (error) {
      showErrorNotification("Validation error");
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((err) => err.message),
      });
    }

    const { amount, description, callbackURL } = req.body;
    const paymentUrl = await createPayment(amount, description, callbackURL);

    showSuccessNotification("Payment created successfully");
    res.status(200).json({ success: true, paymentUrl });
  } catch (error) {
    showErrorNotification(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { error } = verifyPaymentSchema.validate(req.body);
    if (error) {
      showErrorNotification("Validation error");
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((err) => err.message),
      });
    }

    const { authority, amount } = req.body;
    const payment = await verifyPayment(authority, amount);

    showSuccessNotification("Payment verified successfully");
    res.status(200).json({ success: true, payment });
  } catch (error) {
    showErrorNotification(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
