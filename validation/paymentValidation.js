import Joi from "joi";

export const createPaymentSchema = Joi.object({
  amount: Joi.number().positive().required().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be a positive number",
    "any.required": "Amount is required",
  }),
  description: Joi.string().min(3).max(255).required().messages({
    "string.base": "Description must be a string",
    "string.min": "Description must be at least 3 characters",
    "string.max": "Description cannot exceed 255 characters",
    "any.required": "Description is required",
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
