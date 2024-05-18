import { Router } from 'express';
const router = Router();
import {createReservation,getReservations,deleteReservation,updateReservation} from '../controllers/reservation.js';

router.post('/reservation/create/:carId', createReservation);
router.get('/reservation/getAllReservations', getReservations);
router.delete('/reservation/delete/:id', deleteReservation);
router.put('/reservation/update/:id', updateReservation);

export default router;