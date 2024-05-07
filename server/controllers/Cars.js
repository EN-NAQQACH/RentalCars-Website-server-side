import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();
import multer from 'multer';

// async function AddCar(req, res) {
//     try {
//         const { location, model, year, make, price, description, distance, transmission, maxtrip, mintrip,photos,features, carseat} = req.body;
//         const token = req.headers.authorization.split(' ')[1];
//         const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         const userId = decoded.id;
//         const car = await prisma.car.create({
//             data: {
//                 location: location,
//                 model: model,
//                 make: make,
//                 features: features,
//                 year: year,
//                 price: price,
//                 description: description,
//                 distance: distance,
//                 transmission: transmission,
//                 maxTrip: maxtrip,
//                 minTrip: mintrip,
//                 carSeats: carseat,
//                 imageUrls:photos,
//                 userId: userId,
//             },
//         });
//         if (!car) {
//             return res.status(400).json({ error: "Car not added" });
//         }
//         res.status(200).json({ message: "Car added" });
//     } catch (error) {
//         if (error.name === 'JsonWebTokenError') {
//             return res.status(401).json({ error: "Unauthorized" });
//         }else if(error.name === '_TokenExpiredError'){
//             return res.status(401).json({ error: "token expired" });
//         } else {
//             console.error(error);
//             res.status(500).json({ error: 'Server Error' });
//         }
//     }
// }

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

async function AddCar(req,res){
    try {
        const { location,fuel, model, year, make, price, description, distance, transmission, maxtrip, mintrip, features, type, carseat } = req.body;
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decoded.id;
        const imageUrls = req.files.map(file => "http://localhost:5600/" + file.path);
        const car = await prisma.car.create({
            data: {
                location: location,
                model: model,
                make: make,
                fuel:fuel,
                Type:type,
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
}
async function UpdateCar(req, res) {
    try {

        const { location, model, year, make, price, description, distance, transmission, maxtrip, mintrip, features, carseat} = req.body;

        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decoded.id;
        const car = await prisma.car.update({
            where: {
                userId:userId,
                id:req.params.carId,
            },
            data: {
                location: location,
                model: model,
                make: make,
                features: features,
                year: parseInt(year),
                price: parseFloat(price),
                description: description,
                distance: distance,
                transmission: transmission,
                maxTrip: parseInt(maxtrip),
                minTrip: parseInt(mintrip),
                carSeats: parseInt(carseat),
                userId: userId,
            },
        });
        if (!car) {
            return res.status(400).json({ error: "Car not updated" });
        }
        res.status(200).json({ message: "Car updated" });
    }catch(error){
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Unauthorized" });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Server Error' });
        }
    }
}
async function DeleteCar(req, res) {
    try {
        const car = await prisma.car.delete({
            where: {
                id: req.params.id,
            },
        });
        if (!car) {
            return res.status(400).json({ error: "Car not deleted" });
        }
        res.status(200).json({ message: "Car deleted" });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Unauthorized" });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Server Error' });
        }
    }
}
async function GetAllCars(req, res) {
    try {
        const cars = await prisma.car.findMany();
        res.status(200).json(cars);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
}
async function GetCarsUser(req, res) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decoded.id;
        const car = await prisma.car.findMany({
            where: {
                userId: userId,
            },
        });
        if (!car) {
            return res.status(404).json({ error: "Car not found" });
        }
        res.status(200).json(car);
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Unauthorized" });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Server Error' });
        }
    }
}
async function GetaUserCar(req,res){
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decoded.id;
        const car = await prisma.car.findUnique({
            where: {
                userId:userId,
                id:req.params.carId,
            },
        });
        if (!car) {
            return res.status(404).json({ error: "Car not found" });
        }
        res.status(200).json(car);
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Unauthorized" });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Server Error' });
        }
    }
    
}
export { AddCar,upload,GetCarsUser,GetaUserCar};