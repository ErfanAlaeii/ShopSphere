import express from 'express';
import { loginUser, registerUser, verifyToken, refreshAccessToken } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-token', verifyToken);
router.get('/me', authenticate); 
router.post('/refresh-token', refreshAccessToken);

export default router;
