
import { Router } from 'express';
const router = Router();
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Specify the directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Define the filename for the uploaded file
    }
  });
  
  // Initialize multer instance
  const upload = multer({ storage: storage });

router.post('/addcar', upload.array('photos'), async (req, res) => {
    try {
        const { location, model, year, make, price, description, distance, transmission, maxtrip, mintrip, features, carseat } = req.body;
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decoded.id;
        const imageUrls = req.files.map(file => file.path);
        const car = await prisma.car.create({
            data: {
                location: location,
                model: model,
                make: make,
                features: features,
                year: parseInt(year),
                price: parseFloat(price),
                description: description,
                distance: distance,
                imageUrls: imageUrls,
                transmission: transmission,
                maxTrip: parseInt(maxtrip),
                minTrip: parseInt(mintrip),
                carSeats: parseInt(carseat),
                userId: userId,
            },
        });
        if (!car) {
            return res.status(400).json({ error: "Car not added" });
        }
        res.status(200).json({ message: "Car added" });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Unauthorized" });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Server Error' });
        }
    }
});
export default router;