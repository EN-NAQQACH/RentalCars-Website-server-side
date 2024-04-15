
import { Router } from 'express';
const router = Router();
import { createUser, showmessage} from '../controllers/users.js';



/**
 * @swagger
 * /api/signup:
 *   post:
 *     tags:
 *       - Users
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
 *       500:
 *         description: Internal server error
 */

router.post('/signup', createUser);

// /**
//  * @swagger
//  * /users/{id}:
//  *   get:
//  *     summary: Get user by ID
//  *     tags: [Users]
//  *     description: Returns a single user by ID.
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: User ID
//  *     responses:
//  *       200:
//  *         description: A user object.
//  */
// router.get('/:id', (req, res) => {
//   res.send(`User ID: ${req.params.id}`);
// });


/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: display users
 *     description: display users

 *     responses:
 *       200:
 *         description: User created successfully
 *       500:
 *         description: Internal server error
 */

router.get('/users', showmessage);

export default router;
