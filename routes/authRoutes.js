import express from 'express';
import { loginUser, registerUser, verifyToken, refreshAccessToken ,logoutUser} from '../controllers/authController.js';
import { authenticate,authorizeRoles } from '../middlewares/authMiddleware.js';
import { getAdminData } from '../controllers/adminController.js';


const router = express.Router();

router.get('/admin-only', authenticate, authorizeRoles('admin'), getAdminData);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-token', verifyToken);
router.get('/me', authenticate); 
router.post('/refresh-token', refreshAccessToken);
router.post("/logout", logoutUser);



export default router;
