
import { Router } from 'express';
const router = Router();
import { AddCar,upload } from '../controllers/Cars';

router.post('/addcar',upload.single('image'),AddCar);