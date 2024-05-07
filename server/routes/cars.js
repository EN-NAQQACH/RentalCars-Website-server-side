
import { Router } from 'express';
const router = Router();
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();
import multer from 'multer';
import { AddCar,upload,GetCarsUser,GetaUserCar } from '../controllers/cars.js';

router.post('/addcar', upload.array('photos'), AddCar);
router.get('/getcar', GetCarsUser);
router.get('/getusercar/:carId', GetaUserCar);

// router.post('/addcar',AddCar);
export default router;