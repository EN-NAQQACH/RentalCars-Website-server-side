import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    },
});

const upload = multer({ storage: storage });



async function AddCar(req, res) {
    try {
        const { location, model, year,make, price, description, distance, transmission, maxTrip, minTrip, imageUrls, features, carSeats } = req.body;
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decoded.id;
        const listphotos = req.files;
        if (!listphotos) {
            return res.status(400).json({ message: 'No photos uploaded' });
        }
        const images = listphotos.map(photo => photo.path);
        const car = await prisma.car.create({
            data: {
                location: location,
                model: model,
                make: make,
                year: year,
                price: price,
                description: description,
                distance: distance,
                transmission: transmission,
                maxTrip: maxTrip,
                minTrip: minTrip,
                imageUrls: images,
                features: features,
                carSeats: carSeats,
                userId: userId,
            },
        });
        res.status(200).json({message: "Car added"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
export { AddCar,upload };