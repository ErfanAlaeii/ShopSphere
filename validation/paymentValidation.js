import Joi from "joi";

export const createPaymentSchema = Joi.object({
  user: Joi.string().required().messages({
    "string.base": "User must be a valid string",
    "any.required": "User is required",
  }),
  order: Joi.string().required().messages({
    "string.base": "Order must be a valid string",
    "any.required": "Order is required",
  }),
  amount: Joi.number().positive().required().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be a positive number",
    "any.required": "Amount is required",
  }),
  callbackURL: Joi.string().uri().required().messages({
    "string.base": "Callback URL must be a valid string",
    "string.uri": "Callback URL must be a valid URL",
    "any.required": "Callback URL is required",
  }),
});

export const verifyPaymentSchema = Joi.object({
  authority: Joi.string().required().messages({
    "string.base": "Authority must be a string",
    "any.required": "Authority is required",
  }),
  amount: Joi.number().positive().required().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be a positive number",
    "any.required": "Amount is required",
  }),
});
