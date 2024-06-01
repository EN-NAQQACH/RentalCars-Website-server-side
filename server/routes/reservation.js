import { Router } from 'express';
const router = Router();
import {createReservation,getReservations,deleteReservation,updateReservation} from '../controllers/reservation.js';
/**
 * @swagger
 * /api/cars/reservation/create/{carId}:
 *   post:
 *     summary: Create a reservation for a car
 *     tags: [Reservations]
 *     description: Create a reservation for a specific car with the provided car ID
 *     parameters:
 *       - in: path
 *         name: carId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the car for which the reservation is made
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: The start date of the reservation
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: The end date of the reservation
 *               status:
 *                 type: string
 *                 description: The status of the reservation (optional)
 *               totalPrice:
 *                 type: number
 *                 description: The total price of the reservation
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reservation created successfully
 *       400:
 *         description: Bad request. The user already reserved this car.
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       500:
 *         description: Internal server error.
 */
router.post('/reservation/create/:carId', createReservation);
/**
 * @swagger
 * /api/cars/reservation/getAllReservations:
 *   get:
 *     summary: Get all reservations
 *     tags: [Reservations]
 *     description: Retrieve all reservations along with relevant statistics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Filter reservations based on status (optional)
 *     responses:
 *       200:
 *         description: Reservations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservationsByUser:
 *                   type: array
 *                   items:
 *                     type: object
 *                 totalCars:
 *                   type: number
 *                 totalPendingReservations:
 *                   type: number
 *                 totalConfirmedReservations:
 *                   type: number
 *                 totalUsersReserved:
 *                   type: number
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       404:
 *         description: No reservations found.
 *       500:
 *         description: Internal server error.
 */
router.get('/reservation/getAllReservations', getReservations);
/**
 * @swagger
 * /api/cars/reservation/delete/{id}:
 *   delete:
 *     summary: Delete a reservation
 *     tags: [Reservations]
 *     description: Delete a reservation with the provided reservation ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the reservation to delete
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reservation deleted successfully
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       500:
 *         description: Internal server error.
 */
router.delete('/reservation/delete/:id', deleteReservation);
/**
 * @swagger
 * /api/cars/reservation/update/{id}:
 *   put:
 *     summary: Update a reservation
 *     tags: [Reservations]
 *     description: Update the status of a reservation with the provided reservation ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the reservation to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new status of the reservation
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       500:
 *         description: Internal server error.
 */
router.put('/reservation/update/:id', updateReservation);

export default router;