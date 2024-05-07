import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();
import multer from 'multer';
import fs from 'fs';
import path from 'path';

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
async function AddCar(req, res) {
    try {
        const { location, fuel, model, year, make, price, description, distance, transmission, maxtrip, mintrip, features, type, carseat } = req.body;
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decoded.id;
        const imageUrls = req.files.map(file => "http://localhost:5600/" + file.path);
        const car = await prisma.car.create({
            data: {
                location: location,
                model: model,
                make: make,
                fuel: fuel,
                Type: type,
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
        const { location,type, model, year,fuel, make, price, description, distance, transmission, maxtrip, mintrip, features, carseat, deletedImages, newPhotos } = req.body;
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decoded.id;
        const newPhotosAdded = req.files.map(file => "http://localhost:5600/" + file.path);
        let updatedImageUrls = []
        let car = await prisma.car.findUnique({
            where: {
                userId: userId,
                id: req.params.carId,
            },
        });
        if (!car) {
            return res.status(404).json({ error: "Car not found" });
        }

        if (deletedImages && deletedImages.length > 0) {
            updatedImageUrls = car.imageUrls.filter(url => !deletedImages.includes(url));
           const carupdated = await prisma.car.update({
                where: {
                    userId: userId,
                    id: req.params.carId,
                },
                data: {
                    location: {
                        set: location
                    },
                    model: {
                        set: model
                    },
                    make: {
                        set: make
                    },
                    features: {
                        set: features
                    },
                    year: {
                        set: parseInt(year)
                    },
                    price: {
                        set: parseFloat(price)
                    },
                    description: {
                        set: description
                    },
                    distance: {
                        set: distance
                    },
                    transmission: {
                        set: transmission
                    },
                    maxTrip: {
                        set: parseInt(maxtrip)
                    },
                    minTrip: {
                        set: parseInt(mintrip)
                    },
                    carSeats: {
                        set: parseInt(carseat)
                    },
                    Type:{
                        set: type,
                    },
                    fuel:{
                        set: fuel,
                    },
                    imageUrls: {
                        set: updatedImageUrls
                    }
                }
            });
            if(carupdated){
                res.status(200).json({ message: "Car updated" });
            }else{
                res.status(400).json({ error: "Car not updated" });
            }
            deletedImages.forEach(url => {
                const filename = path.basename(url.replace(/\\/g, '/'));
                const filePath = path.join('uploads', filename)
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Error deleting file:", err);
                    } else {
                        console.log("File deleted successfully");
                    }
                });
            });
        }else
        if (newPhotosAdded && newPhotosAdded.length > 0) {
            updatedImageUrls = [...car.imageUrls, ...newPhotosAdded];
            const carupdated = await prisma.car.update({
                where: {
                    userId: userId,
                    id: req.params.carId,
                },
                data: {
                    location: {
                        set: location
                    },
                    model: {
                        set: model
                    },
                    make: {
                        set: make
                    },
                    features: {
                        set: features
                    },
                    year: {
                        set: parseInt(year)
                    },
                    price: {
                        set: parseFloat(price)
                    },
                    description: {
                        set: description
                    },
                    distance: {
                        set: distance
                    },
                    transmission: {
                        set: transmission
                    },
                    maxTrip: {
                        set: parseInt(maxtrip)
                    },
                    minTrip: {
                        set: parseInt(mintrip)
                    },
                    carSeats: {
                        set: parseInt(carseat)
                    },
                    Type:{
                        set: type,
                    },
                    fuel:{
                        set: fuel,
                    },
                    imageUrls: {
                        set: updatedImageUrls
                    }
                }
            });
            if(carupdated){
                res.status(200).json({ message: "Car updated" });
            }else{
                res.status(400).json({ error: "Car not updated" });
            }
        }else{
            const carupdated = await prisma.car.update({
                where: {
                    userId: userId,
                    id: req.params.carId,
                },
                data: {
                    location: {
                        set: location
                    },
                    model: {
                        set: model
                    },
                    make: {
                        set: make
                    },
                    features: {
                        set: features
                    },
                    year: {
                        set: parseInt(year)
                    },
                    price: {
                        set: parseFloat(price)
                    },
                    description: {
                        set: description
                    },
                    distance: {
                        set: distance
                    },
                    transmission: {
                        set: transmission
                    },
                    maxTrip: {
                        set: parseInt(maxtrip)
                    },
                    minTrip: {
                        set: parseInt(mintrip)
                    },
                    carSeats: {
                        set: parseInt(carseat)
                    },
                    Type:{
                        set: type,
                    },
                    fuel:{
                        set: fuel,
                    }
                }
            });
            if(carupdated){
                res.status(200).json({ message: "Car updated" });
            }else{
                res.status(400).json({ error: "Car not updated" });
            }
        }

    } catch (error) {
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
async function GetaUserCar(req, res) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decoded.id;
        const car = await prisma.car.findUnique({
            where: {
                userId: userId,
                id: req.params.carId,
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
export { AddCar, upload, GetCarsUser, GetaUserCar, UpdateCar };