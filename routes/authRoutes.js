import express from 'express';
import { loginUser,verifyToken } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/verify-token', verifyToken);
router.get('/me', authenticate); 

export default router;
