import {
  createPayment,
  verifyPayment,
  getPaymentByAuthority,
  getPaymentsByUser,
} from "../services/paymentService.js";
import {
  createPaymentSchema,
  verifyPaymentSchema,
} from "../validation/paymentValidation.js";

export const initiatePayment = async (req, res) => {
  try {
    const { error, value } = createPaymentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((err) => err.message),
      });
    }

    const result = await createPayment(value.order, value.user);

    res.status(201).json({
      success: true,
      message: "Payment initiated successfully",
      data: {
        paymentUrl: result.paymentUrl,
        authority: result.authority,
      },
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { error, value } = verifyPaymentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((err) => err.message),
      });
    }

    const result = await verifyPayment(value.authority, value.amount);

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: {
        refId: result.refId,
        payment: result.payment,
        order: result.order,
      },
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPaymentStatus = async (req, res) => {
  try {
    const { authority } = req.params;
    const payment = await getPaymentByAuthority(authority);

    if (!payment) {
      throw new Error("The desired payment was not found!");
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserPayments = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!req.user.id === userId) {
      throw new Error("You do not have permission to view this information");
    }
    const payments = await getPaymentsByUser(userId);

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};
