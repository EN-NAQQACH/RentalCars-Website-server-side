
import { Router } from 'express';
const router = Router();
import multer from 'multer';
import { createUser,google,login,googlelogin,getUser,updateUser,resetPassword,upload,getUserCar,getMyreservations} from '../controllers/users.js';
import {contactus} from '../controllers/contactus.js';
import {addEmailToNewsletters} from '../controllers/newsletter.js';
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users endpoints
 */
/**
 * @swagger
 * /api/account/signup:
 *   post:
 *     tags: [Users]
 *     summary: create a new user
 *     description: Creates a new user with the provided information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name of the user
 *               lastName:
 *                 type: string
 *                 description: Last name of the user
 *               email:
 *                 type: string
 *                 description: Email address of the user
 *               password:
 *                 type: string
 *                 description: Password of the user
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: the user creation was successful
 *       400:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
router.post('/account/signup', createUser);
/**
 * @swagger
 * /api/account/login:
 *   get:
 *     summary: login
 *     tags: [Users]
 *     description: Login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the user
 *               password:
 *                 type: string
 *                 description: Password of the user
 *     responses:
 *       200:
 *         description: Login successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Login successfully
 *               token: token_generated
 *       400:
 *         description: User not found / Incorrect password
 *       500:
 *         description: Internal server error
 */
router.post('/account/login', login);
/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: signup with google
 *     tags: [Users]
 *     description: signup with google.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: firstname of the user
 *               lastName:
 *                 type: string
 *                 description: lastName of the user
 *               email:
 *                 type: string
 *                 description: email of the user
 *               password:
 *                 type: string
 *                 description: password of the user
 *               picture:
 *                 type: string
 *                 description: picture of the user
 *               googleId:
 *                 type: string
 *                 description: googleId of the user
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: signup successfully
 *               token: token_generated
 *       400:
 *         description: User already exists
 *       500:
 *         description: Error creating user
 */
router.post('/auth/google', google);
/**
 * @swagger
 * /api/auth/googlelogin:
 *   get:
 *     summary: login with google
 *     tags: [Users]
 *     description: login with google.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               googleId:
 *                 type: string
 *                 description: googleId of the user
 *     responses:
 *       200:
 *         description: Login successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Login successfully
 *               token: token_generated
 *       400:
 *         description: User not found / Incorrect password
 *       500:
 *         description: Internal server error
 */
router.post('/auth/googlelogin', googlelogin);
/**
 * @swagger
 * /api/users/info:
 *   get:
 *     summary: Get user information
 *     tags: [Users]
 *     description: Retrieves user information based on the provided JWT token.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The user's ID
 *                 email:
 *                   type: string
 *                   description: The user's email address
 *                 firstName:
 *                   type: string
 *                   description: The user's first name
 *                 lastName:
 *                   type: string
 *                   description: The user's last name
 *                 number:
 *                   type: string
 *                   description: The user's phone number
 *                 about:
 *                   type: string
 *                   description: A brief description about the user
 *                 googleId:
 *                   type: string
 *                   description: The user's Google ID (if available)
 *                 picture:
 *                   type: string
 *                   description: The user's picture (if available)
 *       401:
 *         description: Invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/users/info', getUser);
/**
 * @swagger
 * /api/users/update:
 *   put:
 *     summary: Update user information
 *     tags: [Users]
 *     description: Update user information based on the provided JWT token.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The user's first name
 *               lastName:
 *                 type: string
 *                 description: The user's last name
 *               email:
 *                 type: string
 *                 description: The user's email address
 *               number:
 *                 type: string
 *                 description: The user's phone number
 *               about:
 *                 type: string
 *                 description: A brief description about the user
 *     responses:
 *       200:
 *         description: User information updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: User updated successfully
 *       400:
 *         description: Missing 'about' or 'number' fields
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put('/users/update',upload.single('photo'), updateUser);
/**
 * @swagger
 * /api/users/resetpassword:
 *   post:
 *     tags: [Users]
 *     summary: Reset Password by sending email
 *     description: Reset Password by a message in email'suer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the user
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Email sent successfully
 *       400:
 *         description: there is no user with email given
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Failed to send email
 */
router.post('/users/resetpassword',resetPassword);
router.get('/users/profile/:userid', getUserCar);
router.post('/contactus', contactus);
router.post('/newsletter', addEmailToNewsletters);
router.get('/user/myreservations', getMyreservations);
export default router;
