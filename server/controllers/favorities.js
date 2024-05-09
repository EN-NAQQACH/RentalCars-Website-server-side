import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

async function Save(req, res) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "Please Login !" });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decoded.id;

        const savedPost = await prisma.favorite.findFirst({
            where: {
                userId: userId,
                carId: req.params.id,
            },
        });

        if (savedPost) {
            await prisma.favorite.delete({
                where: {
                    id: savedPost.id,
                },
            });
            res.status(200).json({ message: "Removed from your favorites" });
        } else {
            await prisma.favorite.create({
                data: {
                    userId: userId,
                    carId: req.params.id,
                },
            });
            res.status(200).json({ message: "Card saved to your favorites" });
        }
    } catch (e) {
        if (e.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Please Login !" });
        } else {
            console.error(e);
            res.status(500).json({ error: 'Server Error' });
        }
    }
}
async function GetUserFavorites(req, res) {
    try {
        // Get the token from the request header
        const token = req.headers.authorization.split(' ')[1];
        
        // Verify the token to get the user ID
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decoded.id;

        // Find all favorites of the current user
        const favorites = await prisma.favorite.findMany({
            where: {
                userId: userId,
            },
        });

        // Retrieve car details for each favorite
        const cars = [];
        for (const favorite of favorites) {
            const car = await prisma.car.findUnique({
                where: {
                    id: favorite.carId,
                },
            });
            if (car) {
                cars.push(car);
            }
        }

        // Respond with the list of cars saved in favorites
        res.status(200).json(cars);
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Unauthorized" });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Server Error' });
        }
    }
}
export {Save,GetUserFavorites};