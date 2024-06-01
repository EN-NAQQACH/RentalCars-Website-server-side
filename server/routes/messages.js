import { Router } from 'express';
const router = Router();
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();


import { AddMessage,RemoveMessage,UpdateSeenBy } from '../controllers/messages.js';
/**
 * @swagger
 * /api/chats/Messages/{chatId}:
 *   post:
 *     summary: Add a message to a chat
 *     tags: [Messages]
 *     description: Add a new message to the specified chat.
 *     parameters:
 *       - in: path
 *         name: chatId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the chat to add the message to
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the message
 *               photoUrl:
 *                 type: string
 *                 description: The URL of any attached photo (optional)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Message added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the added message
 *                 content:
 *                   type: string
 *                   description: The content of the added message
 *                 userId:
 *                   type: string
 *                   description: The ID of the user who added the message
 *                 chatId:
 *                   type: string
 *                   description: The ID of the chat to which the message was added
 *                 hour:
 *                   type: string
 *                   description: The time the message was added
 *       '401':
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       '500':
 *         description: Internal server error.
 */

router.post('/Messages/:chatId', AddMessage);
/**
 * @swagger
 * /api/chats/Messages/{messageId}/{chatId}:
 *   delete:
 *     summary: Remove a message from a chat
 *     tags: [Messages]
 *     description: Remove a message from the specified chat.
 *     parameters:
 *       - in: path
 *         name: messageId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the message to remove
 *       - in: path
 *         name: chatId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the chat containing the message
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Message deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating the message was deleted
 *                 chat:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The ID of the chat from which the message was deleted
 *                     userIDs:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: An array of user IDs associated with the chat
 *                     lastMessage:
 *                       type: string
 *                       description: The content of the last message in the chat after deletion
 *       '401':
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       '404':
 *         description: Chat or message not found
 *       '500':
 *         description: Internal server error.
 */

router.delete('/Messages/:messageId/:chatId', RemoveMessage);
router.post('/Messages/seenby/:chatId', UpdateSeenBy);

export default router;