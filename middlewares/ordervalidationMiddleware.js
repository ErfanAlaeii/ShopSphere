export const validateOrderRequest = (req, res, next) => {
  const { products, totalAmount } = req.body;

  if (!products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: 'Order products are required' });
  }

  if (!totalAmount || typeof totalAmount !== 'number' || totalAmount <= 0) {
    return res.status(400).json({ error: 'Invalid total amount' });
  }

  next();
};
