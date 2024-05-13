import { Router } from 'express';
const router = Router();
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();
import { GetallChats,AddChat,GetChat} from '../controllers/chats.js'


router.get('/chats',GetallChats);
router.post('/chats/Add', AddChat);
router.get('/chats/:chatId', GetChat);


export default router;
