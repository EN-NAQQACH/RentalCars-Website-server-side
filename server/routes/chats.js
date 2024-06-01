import { Router } from 'express';
const router = Router();
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();
import { GetallChats,AddChat,GetChat,ReadChat,searchByuser,AddChatandMessage} from '../controllers/chats.js'


/**
 * @swagger
 * /api/chats/Add:
 *   post:
 *     summary: Add a chat
 *     tags: [Chats]
 *     description: Add a new chat between two users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reseivedById:
 *                 type: string
 *                 description: The ID of the user who will receive the chat
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Chat added successfully
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       500:
 *         description: Internal server error.
 */
router.post('/chats/Add', AddChat);
/**
 * @swagger
 * /api/chats/{chatId}:
 *   get:
 *     summary: Get chat details
 *     tags: [Chats]
 *     description: Retrieve chat details including messages and users involved
 *     parameters:
 *       - in: path
 *         name: chatId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the chat to retrieve
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chat details retrieved successfully
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       500:
 *         description: Internal server error.
 */
router.get('/chats/:chatId', GetChat);
/**
 * @swagger
 * /chats:
 *   get:
 *     summary: Get user chats
 *     tags: [Chats]
 *     description: Retrieve chats for the authenticated user, including messages and information about the other user involved in each chat.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User chats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userIDs:
 *                     type: array
 *                     items:
 *                       type: string
 *                   reseivedUser:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       picture:
 *                         type: string
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       500:
 *         description: Internal server error.
 */


router.get('/chats',GetallChats);
router.put('/chats/:chatId', ReadChat);
/**
 * @swagger
 * /chats/search/getUsers:
 *   get:
 *     summary: Search users in chats
 *     tags: [Chats]
 *     description: Search for users involved in chats based on the provided search input. Returns chats where the received user matches the search query.
 *     parameters:
 *       - in: query
 *         name: searchinput
 *         schema:
 *           type: string
 *         description: The search input to filter users by first name or last name.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userIDs:
 *                     type: array
 *                     items:
 *                       type: string
 *                   reseivedUser:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       picture:
 *                         type: string
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       500:
 *         description: Internal server error.
 */

router.get('/chats/search/getUsers', searchByuser);
router.post('/chats/AddandMessage', AddChatandMessage);

export default router;
