import Joi from "joi";

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email",
    }),
  });
  