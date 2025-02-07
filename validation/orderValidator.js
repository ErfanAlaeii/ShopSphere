import Joi from "joi";

export const createOrderSchema = Joi.object({
    userId: Joi.string().required().messages({
        "string.empty": "User ID is required",
        "any.required": "User ID is required",
    }),
    products: Joi.array()
        .items(
            Joi.object({
                product: Joi.string().required().messages({
                    "string.empty": "Product ID is required",
                    "any.required": "Product ID is required",
                }),
                quantity: Joi.number().integer().positive().required().messages({
                    "number.base": "Quantity must be a number",
                    "number.positive": "Quantity must be greater than zero",
                    "any.required": "Quantity is required",
                }),
                price: Joi.number().positive().required().messages({
                    "number.base": "Price must be a number",
                    "number.positive": "Price must be greater than zero",
                    "any.required": "Price is required",
                }),
            })
        )
        .min(1)
        .required()
        .messages({
            "array.base": "Products must be an array",
            "array.min": "At least one product is required",
            "any.required": "Products are required",
        }),
    totalPrice: Joi.number().min(0).required().messages({
        "number.base": "Total price must be a number",
        "number.min": "Total price cannot be negative",
        "any.required": "Total price is required",
    }),
    discount: Joi.number().min(0).default(0).messages({
        "number.base": "Discount must be a number",
        "number.min": "Discount cannot be negative",
    }),
    finalPrice: Joi.number().min(0).required().messages({
        "number.base": "Final price must be a number",
        "number.min": "Final price cannot be negative",
        "any.required": "Final price is required",
    }),
    shippingAddress: Joi.string().required().messages({
        "string.empty": "Shipping address is required",
        "any.required": "Shipping address is required",
    }),
    status: Joi.string()
        .valid("pending", "processing", "shipped", "completed", "cancelled")
        .default("pending")
        .messages({
            "any.only": "Invalid order status",
        }),
    paymentStatus: Joi.string()
        .valid("unpaid", "paid", "failed", "refunded")
        .default("unpaid")
        .messages({
            "any.only": "Invalid payment status",
        }),
    paymentDetails: Joi.object({
        transactionId: Joi.string().optional().messages({
            "string.base": "Transaction ID must be a string",
        }),
        paymentMethod: Joi.string().optional().messages({
            "string.base": "Payment method must be a string",
        }),
        paymentDate: Joi.date().optional().messages({
            "date.base": "Payment date must be a valid date",
        }),
    }).optional(),
    shippingStatus: Joi.string()
        .valid("not_shipped", "shipped", "in_transit", "delivered", "returned")
        .default("not_shipped")
        .messages({
            "any.only": "Invalid shipping status",
        }),
    shippedDate: Joi.date().optional().messages({
        "date.base": "Shipped date must be a valid date",
    }),
    deliveryDate: Joi.date().optional().messages({
        "date.base": "Delivery date must be a valid date",
    }),
});
