const errorHandler = (err, req, res, next) => {
  if (err.message === "Not Found") {
    return res
      .status(404)
      .json({ success: false, message: "Resource not found" });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.errors,
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }

  console.error(err.stack);
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

export default errorHandler;
