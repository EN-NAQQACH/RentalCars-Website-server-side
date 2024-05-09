import { Router } from 'express';
const router = Router();
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();
import multer from 'multer';
import {Save,GetUserFavorites} from '../controllers/favorities.js'

router.post('/save/:id',Save);
router.get('/getuserfavorites',GetUserFavorites);

export default router ;