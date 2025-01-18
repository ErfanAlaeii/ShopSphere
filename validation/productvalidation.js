import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().max(100).required(),
  price: Joi.number().positive().required(),
  description: Joi.string().required(),
  stock: Joi.number().integer().min(0).required(),
  category: Joi.string().required(),
  images: Joi.array().items(Joi.string().uri()),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().max(100),
  price: Joi.number().positive(),
  description: Joi.string(),
  stock: Joi.number().integer().min(0),
  category: Joi.string(),
  images: Joi.array().items(Joi.string().uri()),
});
