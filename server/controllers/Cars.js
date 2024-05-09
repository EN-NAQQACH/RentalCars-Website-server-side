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
        const token = req.headers.authorization.split(' ')[1];
        let cars = await prisma.car.findMany();

        if (token) {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const userId = decoded.id;

            // Fetch all favorites of the current user
            const favorites = await prisma.favorite.findMany({
                where: {
                    userId: userId,
                },
            });

            // Create a map to store the saved status of each car
            const savedStatusMap = {};
            favorites.forEach(favorite => {
                savedStatusMap[favorite.carId] = true; // Car is saved by the user
            });

            // Add isSaved property to each car
            cars = cars.map(car => ({
                ...car,
                isSaved: savedStatusMap[car.id] || false, // Default to false if not saved
            }));
        }

        res.status(200).json(cars);
    } catch (e) {
        if (e.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Unauthorized" });
        } else {
            console.error(e);
            res.status(500).json({ error: 'Server Error' });
        }
    }
}
async function GetAllCarsUnauth(req, res) {
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
async function GetaUserCarUnauth(req, res) {
    try {
        const car = await prisma.car.findUnique({
            where: {
                id: req.params.carId,
            },
        });
        let user = await prisma.user.findUnique({
            where: {
                id: car.userId,
            },
        })
        if (!car) {
            return res.status(404).json({ error: "Car not found" });
        }
        const obj = {
            car: car,
            user: user,
        }
        res.status(200).json(obj);
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Unauthorized" });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Server Error' });
        }
    }
}
async function GetCarAuth(req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        let car = await prisma.car.findUnique({
            where: {
                id: req.params.carId,
            },
        });
        let user = await prisma.user.findUnique({
            where: {
                id: car.userId,
            },
        })
        if (!car) {
            return res.status(404).json({ error: "Car not found" });
        }

        if (token) {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const userId = decoded.id;

            // Check if the car is saved by the user
            const favorite = await prisma.favorite.findFirst({
                where: {
                    userId: userId,
                    carId: req.params.carId,
                },
            });

            // Set isSaved property based on the saved status
            car = {
                ...car,
                isSaved: favorite ? true : false,
            };
        }
        const obj = {
            car: car,
            user: user,
        }
        res.status(200).json(obj);
    } catch (e) {
        if (e.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Unauthorized" });
        } else {
            console.error(e);
            res.status(500).json({ error: 'Server Error' });
        }
    }
}

// async function DeleteCars(req,res){
//     try{
//         const token = req.headers.authorization.split(' ')[1];
//         const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         const userId = decoded.id;
//         const car = await prisma.car.delete({
//             where: {
//                 userId: userId,
//                 id: req.params.carId,
//             },
//         });
//         if(car){
//             res.status(200).json({message:"car deleted"});
//         }
//     }catch(e){
//         if (e.name === 'JsonWebTokenError') {
//             return res.status(401).json({ error: "Unauthorized" });
//         } else {
//             console.error(e);
//             res.status(500).json({ error: 'Server Error' });
//         }
//     }


// }
async function DeleteCars(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const userId = decoded.id;
      const carId = req.params.carId;
  
      // Check if the car exists and belongs to the user
      const car = await prisma.car.findFirst({
        where: {
          userId: userId,
          id: carId,
        },
        include: {
          favorites: true,
        },
      });
  
      if (!car) {
        return res.status(404).json({ error: "Car not found" });
      }
  
      // Delete associated favorite records, if any
      if (car.favorites && car.favorites.length > 0) {
        await Promise.all(car.favorites.map(async (favorite) => {
          await prisma.favorite.delete({
            where: {
              id: favorite.id,
            },
          });
        }));
      }
  
      // Delete the car
      await prisma.car.delete({
        where: {
          userId: userId,
          id: carId,
        },
      });
  
      res.status(200).json({ message: "Car deleted" });
    } catch (e) {
      if (e.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: "Unauthorized" });
      } else {
        console.error(e);
        res.status(500).json({ error: 'Server Error' });
      }
    }
  }
  
export { AddCar, upload, GetCarsUser, GetaUserCarUnauth,GetCarAuth, UpdateCar,GetAllCars,GetAllCarsUnauth,DeleteCars};