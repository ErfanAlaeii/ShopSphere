export const validateOrderRequest = (req, res, next) => {
    const { items, totalAmount } = req.body;
  
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order items are required' });
    }
  
    if (!totalAmount || typeof totalAmount !== 'number' || totalAmount <= 0) {
      return res.status(400).json({ error: 'Invalid total amount' });
    }
  
    next();
  };
  