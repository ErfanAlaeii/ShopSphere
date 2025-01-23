import Joi from "joi";

export const validateRefreshTokenRequest = (req, res, next) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required().trim(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};
