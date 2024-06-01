
import { Router } from 'express';
const router = Router();
import multer from 'multer';
import { createUser, google, login, googlelogin, getUser, updateUser, resetPassword, upload, getUserCar, getMyreservations } from '../controllers/users.js';
import { contactus } from '../controllers/contactus.js';
import { addEmailToNewsletters } from '../controllers/newsletter.js';
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
router.put('/users/update', upload.array('photo'), updateUser);
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
router.post('/users/resetpassword', resetPassword);
/**
 * @swagger
 * /api/users/profile/{userid}:
 *   get:
 *     summary: Get user profile and cars
 *     tags: [Users]
 *     description: Retrieve user profile information and cars based on user ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: userid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: User ID
 *     responses:
 *       200:
 *         description: User profile and cars retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The user's ID
 *                     firstName:
 *                       type: string
 *                       description: The user's first name
 *                     lastName:
 *                       type: string
 *                       description: The user's last name
 *                     email:
 *                       type: string
 *                       description: The user's email address
 *                     picture:
 *                       type: string
 *                       description: The user's picture URL
 *                     googleId:
 *                       type: string
 *                       description: The user's Google ID
 *                     about:
 *                       type: string
 *                       description: Information about the user
 *                     number:
 *                       type: string
 *                       description: The user's phone number
 *                     city:
 *                       type: string
 *                       description: The user's city
 *                     zipcode:
 *                       type: string
 *                       description: The user's zipcode
 *                     address:
 *                       type: string
 *                       description: The user's address
 *                 cars:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The car's ID
 *                       model:
 *                         type: string
 *                         description: The car's model
 *                       make:
 *                         type: string
 *                         description: The car's make
 *                       year:
 *                         type: integer
 *                         description: The car's year
 *                       fuel:
 *                         type: string
 *                         description: The car's fuel type
 *                       Type:
 *                         type: string
 *                         description: The car's type
 *                       price:
 *                         type: number
 *                         description: The car's price
 *                       distance:
 *                         type: string
 *                         description: The car's distance
 *                       transmission:
 *                         type: string
 *                         description: The car's transmission type
 *                       doors:
 *                         type: integer
 *                         description: Number of doors
 *                       imageUrls:
 *                         type: array
 *                         items:
 *                           type: string
 *                           description: URLs of car images
 *                       features:
 *                         type: array
 *                         items:
 *                           type: string
 *                           description: Car features
 *                       carSeats:
 *                         type: integer
 *                         description: Number of car seats
 *                       description:
 *                         type: string
 *                         description: Car description
 *                       startTripDate:
 *                         type: string
 *                         description: Trip start date
 *                       endTripDate:
 *                         type: string
 *                         description: Trip end date
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.get('/users/profile/:userid', getUserCar);
/**
 * @swagger
 * /contactus:
 *   post:
 *     tags: [Users]
 *     summary: Contact us
 *     description: Send a message through the contact us form
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 description: Name of the person
 *               email:
 *                 type: string
 *                 description: Email address of the person
 *               message:
 *                 type: string
 *                 description: Message to be sent
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Message sent successfully
 *       500:
 *         description: Internal server error
 */
router.post('/contactus', contactus);
/**
 * @swagger
 * /newsletter:
 *   post:
 *     tags: [Users]
 *     summary: Subscribe to newsletter
 *     description: Add an email address to the newsletter subscription list
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address to be added to the newsletter
 *     responses:
 *       200:
 *         description: Email added to newsletters
 *         content:
 *           application/json:
 *             example:
 *               message: Email added to newsletters
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */
router.post('/newsletter', addEmailToNewsletters);
/**
 * @swagger
 * /user/myreservations:
 *   get:
 *     tags: [Users]
 *     summary: Get user's reservations
 *     description: Retrieve reservations made by the user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: carName
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           description: Filter reservations by car name
 *       - name: sort
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           description: Sort reservations by date (newest or oldest)
 *     responses:
 *       200:
 *         description: Reservations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The reservation ID
 *                   car:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The car's ID
 *                       model:
 *                         type: string
 *                         description: The car's model
 *                       make:
 *                         type: string
 *                         description: The car's make
 *                       year:
 *                         type: integer
 *                         description: The car's year
 *                   startDate:
 *                     type: string
 *                     format: date
 *                     description: The start date of the reservation
 *                   endDate:
 *                     type: string
 *                     format: date
 *                     description: The end date of the reservation
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Invalid token
 *       500:
 *         description: Internal server error
 */
router.get('/user/myreservations', getMyreservations);
export default router;
