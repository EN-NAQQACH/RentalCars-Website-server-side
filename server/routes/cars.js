
import { Router } from 'express';
const router = Router();
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();
import multer from 'multer';
import { AddCar,upload,GetCarsUser,GetaUserCarUnauth,GetCarAuth,UpdateCar,GetAllCars,GetAllCarsUnauth,DeleteCars,GetAllCarsByMakeAuth,GetAllCarsByMakeunAuth,GetAllCarsByDestinataionAuth,GetAllCarsByDestinataionunAuth} from '../controllers/cars.js';

router.put('/updatecar/:carId',upload.array('photos'), UpdateCar);
router.post('/addcar', upload.array('photos'), AddCar);
router.get('/getcar', GetCarsUser);
router.get('/getusercar/:carId', GetCarAuth);
router.get('/getcarunauth/:carId', GetaUserCarUnauth);
router.get('/getallcars',GetAllCars);
router.get('/getallcarsunauth', GetAllCarsUnauth);
router.delete('/delete/car/:carId',DeleteCars);
router.get('/getallcarsbymake/', GetAllCarsByMakeAuth);
router.get('/getallcarsbymakeunauth/', GetAllCarsByMakeunAuth);
router.get('/getallcarsbydestination/', GetAllCarsByDestinataionAuth);
router.get('/getallcarsbydestinationunauth/', GetAllCarsByDestinataionunAuth);
// router.post('/addcar',AddCar);
export default router;