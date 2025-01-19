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
            })
        )
        .required()
        .messages({
            "array.base": "Products must be an array",
            "any.required": "Products are required",
        }),
    shippingAddress: Joi.string().required().messages({
        "string.empty": "Shipping address is required",
        "any.required": "Shipping address is required",
    }),
});
