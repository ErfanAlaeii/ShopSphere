import Joi from "joi";

export const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name cannot exceed 50 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
  }),
  phone: Joi.string()
    .pattern(/^(\+98|0)?9\d{9}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Please provide a valid Iranian phone number",
    }),
  role: Joi.string().valid("user", "admin").default("user"),
  isActive: Joi.boolean().default(true),
  address: Joi.string().optional().messages({
    "string.empty": "Address cannot be empty",
  }),  
  profilePicture: Joi.string().uri().optional().messages({
    "string.uri": "Please provide a valid URL for profile picture",
  }),  
  emailVerified: Joi.boolean().default(false),  
}).messages({
  "object.unknown": "Invalid field provided",
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string()
    .pattern(/^(\+98|0)?9\d{9}$/)
    .optional(),
  role: Joi.string().valid("user", "admin").optional(),
  isActive: Joi.boolean().optional(),
  address: Joi.string().optional().messages({
    "string.empty": "Address cannot be empty",
  }),  
  profilePicture: Joi.string().uri().optional().messages({
    "string.uri": "Please provide a valid URL for profile picture",
  }),  
}).min(1).messages({
  "object.unknown": "Invalid field provided",
});
