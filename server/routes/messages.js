import { Router } from 'express';
const router = Router();
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

import { AddMessage,RemoveMessage } from '../controllers/messages.js';
router.post('/Messages/:chatId', AddMessage);
router.delete('/Messages/:messageId/:chatId', RemoveMessage);

export default router;