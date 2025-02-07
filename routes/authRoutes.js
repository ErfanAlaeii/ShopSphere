import express from 'express';
import { loginUser, registerUser, verifyToken, refreshAccessToken, logoutUser, verifyEmail } from '../controllers/authController.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';
import { getAdminData } from '../controllers/adminController.js';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and authorization
 */



const router = express.Router();

/**
 * @swagger
 * /auth/admin-only:
 *   get:
 *     summary: Access admin-only data
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data accessible by admin users
 *       401:
 *         description: Unauthorized, token is invalid or missing
 *       403:
 *         description: Forbidden, insufficient permissions
 */

router.get('/admin-only', authenticate, authorizeRoles('admin'), getAdminData);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 */
router.post('/register', registerUser);

router.get("/verify-email", verifyEmail);


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', loginUser);
/**
 * @swagger
 * /auth/verify-token:
 *   post:
 *     summary: Verify the validity of an access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: JWT to verify
 *     responses:
 *       200:
 *         description: Token is valid
 *       400:
 *         description: Token is missing or invalid format
 *       401:
 *         description: Token is invalid or expired
 */
router.post('/verify-token', verifyToken);
/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get details of the authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: User details
 *       401:
 *         description: Unauthorized, token is invalid or missing
 */
router.get('/me', authenticate);
/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Generate a new access token using a refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token
 *     responses:
 *       200:
 *         description: New access token generated successfully
 *       400:
 *         description: Refresh token is missing or invalid format
 *       401:
 *         description: Refresh token is invalid or expired
 */
router.post('/refresh-token', refreshAccessToken);
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out the user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token to invalidate
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       400:
 *         description: Refresh token is missing or invalid format
 *       401:
 *         description: Refresh token is invalid or expired
 */
router.post("/logout", logoutUser);



export default router;
