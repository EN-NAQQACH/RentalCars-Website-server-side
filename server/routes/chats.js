import { Router } from 'express';
const router = Router();
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();
import { GetallChats,AddChat,GetChat,ReadChat,searchByuser} from '../controllers/chats.js'


router.get('/chats',GetallChats);
router.post('/chats/Add', AddChat);
router.get('/chats/:chatId', GetChat);
router.put('/chats/:chatId', ReadChat);
router.get('/chats/search/getUsers', searchByuser);

export default router;
