import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed", "refunded"],
      default: "unpaid",
    },
    paymentDetails: {
      transactionId: { type: String },
      paymentMethod: { type: String },
      amount: { type: Number },
      paymentDate: { type: Date },
    },
    shippingStatus: {
      type: String,
      enum: ["not_shipped", "shipped", "in_transit", "delivered", "returned"],
      default: "not_shipped",
    },
    shippedDate: { type: Date },
    deliveryDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);
