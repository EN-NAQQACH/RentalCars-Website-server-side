import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();
import multer from 'multer';
import fs from 'fs';
import path from 'path';

async function createReservation(req, res) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decoded.id;
        const carId = req.params.carId;
        const { startDate, endDate, status, totalPrice } = req.body;
        const existingReservation = await prisma.reservation.findFirst({
            where: {
                userId: userId,
                carId: carId,
            },
        });
        if (existingReservation) {
            return res.status(400).json({ error: 'You already reserved this car.' });
        }
        const newReservation = await prisma.reservation.create({
            data: {
                userId: userId,
                carId: carId,
                startDate: startDate,
                endDate: endDate,
                status: status || 'pending',
                totalPrice: totalPrice,
            },
        });
        if (newReservation) {
            return res.status(200).json({ message: "Thank you for your reservation. We will contact you soon!" });
        }

    } catch (e) {
        if (e.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Unauthorized" });
        } else {
            console.error(e);
            res.status(500).json({ error: 'Server Error' });
        }
    }
}

// async function getReservations(req, res) {
//     try {
//         const token = req.headers.authorization.split(' ')[1];
//         const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         const hostId = decoded.id;
//         // Retrieve all reservations where the car's owner is the hostId
//         const reservations = await prisma.reservation.findMany({
//             where: {
//                 car: {
//                     userId: hostId,
//                 },
//             },
//             include: {
//                 user: true,
//                 car: true,
//             },
//         });

//         // Retrieve the total number of host's cars
//         const totalCars = await prisma.car.count({
//             where: {
//                 userId: hostId,
//             },
//         });

//         // Retrieve the total number of pending reservations
//         const totalPendingReservations = await prisma.reservation.count({
//             where: {
//                 car: {
//                     userId: hostId,
//                 },
//                 status: 'pending',
//             },
//         });

//         // Retrieve the total number of confirmed reservations
//         const totalConfirmedReservations = await prisma.reservation.count({
//             where: {
//                 car: {
//                     userId: hostId,
//                 },
//                 status: 'confirmed',
//             },
//         });

//         // Retrieve the total number of users who reserved from the host
//         const totalUsersReserved = await prisma.reservation.groupBy({
//             by: ['userId'],
//             where: {
//                 car: {
//                     userId: hostId,
//                 },
//             },
//             _count: true,
//         });

//         if (reservations.length === 0) {
//             return res.status(404).json({ error: 'No reservations found.' });
//         } else {
//             res.status(200).json({
//                 reservations: reservations,
//                 totalCars: totalCars,
//                 totalPendingReservations: totalPendingReservations,
//                 totalConfirmedReservations: totalConfirmedReservations,
//                 totalUsersReserved: totalUsersReserved.length,
//             });
//         }

//     } catch (e) {
//         if (e.name === 'JsonWebTokenError') {
//             return res.status(401).json({ error: "Unauthorized" });
//         } else {
//             console.error(e);
//             res.status(500).json({ error: 'Server Error' });
//         }
//     }
// }

async function getReservations(req, res) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const hostId =decoded.id;
        
        // Retrieve all reservations where the car's owner is the hostId
        const reservations = await prisma.reservation.findMany({
            where: {
                car: {
                    userId: hostId,
                },
            },
            include: {
                user: true,
                car: true,
            },
        });

        // Retrieve the total number of cars
        const totalCars = await prisma.car.count({
            where: {
                userId: hostId,
            },
        });

        // Retrieve the total number of pending reservations
        const totalPendingReservations = await prisma.reservation.count({
            where: {
                car: {
                    userId: hostId,
                },
                status: 'pending',
            },
        });

        // Retrieve the total number of confirmed reservations
        const totalConfirmedReservations = await prisma.reservation.count({
            where: {
                car: {
                    userId: hostId,
                },
                status: 'confirmed',
            },
        });

        // Retrieve the total number of users who reserved from the host
        const totalUsersReserved = await prisma.reservation.groupBy({
                        by: ['userId'],
                        where: {
                            car: {
                                userId: hostId,
                            },
                        },
                        _count: true,
                    });

        // Construct a new object for each user without circular references
        const reservationsByUser = {};
        reservations.forEach(reservation => {
            const userId = reservation.user.id;
            if (!reservationsByUser[userId]) {
                reservationsByUser[userId] = {
                    user: {
                        id: reservation.user.id,
                        firstName: reservation.user.firstName,
                        lastName: reservation.user.lastName,
                        email: reservation.user.email,
                        picture: reservation.user.picture,
                    },
                    reservations: [],
                };
            }
            reservationsByUser[userId].reservations.push({
                id: reservation.id,
                status: reservation.status,
                createdAt: reservation.createdAt,
                startDate: reservation.startDate,
                endDate: reservation.endDate,
                totalPrice: reservation.totalPrice,
                car: {
                    id: reservation.car.id,
                    location: reservation.car.location,
                    year: reservation.car.year,
                    fuel: reservation.car.fuel,
                    Type: reservation.car.Type,
                    price: reservation.car.price,
                    model: reservation.car.model,
                    make: reservation.car.make,
                    distance: reservation.car.distance,
                    transmission: reservation.car.transmission,
                    doors: reservation.car.doors,
                    imageUrls: reservation.car.imageUrls,
                    features: reservation.car.features,
                    carSeats: reservation.car.carSeats,
                    description: reservation.car.description,
                    startTripDate: reservation.car.startTripDate,
                    endTripDate: reservation.car.endTripDate,
                },
            });
        });

        if (Object.keys(reservationsByUser).length === 0) {
            return res.status(404).json({ error: 'No reservations found.' });
        } else {
            res.status(200).json({
                reservationsByUser: Object.values(reservationsByUser),
                totalCars,
                totalPendingReservations,
                totalConfirmedReservations,
                totalUsersReserved: totalUsersReserved.length,
            });
        }

    } catch (e) {
        if (e.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Unauthorized" });
        } else {
            console.error(e);
            res.status(500).json({ error: 'Server Error' });
        }
    }
}



async function updateReservation(req, res) {
    try {
        const reservationId = req.params.id;
        const { status } = req.body;
        const updatedReservation = await prisma.reservation.update({
            where: { id: reservationId },
            data: { status: status },
        });
        if(updatedReservation){
            res.status(200).json({message: "updated seccufully" })
        }
    } catch (e) {
        if (e.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Unauthorized" });
        } else {
            console.error(e);
            res.status(500).json({ error: 'Server Error' });
        }
    }
}
async function deleteReservation(req, res) {
    try {
        const reservationId = req.params.id;
        const deletedReservation = await prisma.reservation.delete({
            where: { id: reservationId },
        });
        if(deletedReservation){
            res.status(200).json({message: "deleted seccufully" })
        }
    } catch (e) {
        if (e.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Unauthorized" });
        } else {
            console.error(e);
            res.status(500).json({ error: 'Server Error' });
        }
    }
}
// async function getReservation (req,res){
//     const reservationId = req.params.id;
//     const reservation = await prisma.reservation.findUnique({
//         where: { id: reservationId },
//     });
//     if(reservation){
//         res.status(200).json(reservation);
//     }
// }
export { createReservation,getReservations,updateReservation,deleteReservation};