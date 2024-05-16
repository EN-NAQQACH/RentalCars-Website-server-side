import { Router } from 'express';
const router = Router();
import {createReservation,getReservations} from '../controllers/reservation.js';

router.post('/reservation/create/:carId', createReservation);
router.get('/reservation/getAllReservations', getReservations);

export default router;