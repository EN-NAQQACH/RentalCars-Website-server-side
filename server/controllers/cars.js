import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: 'uploads', // Cloudinary folder name
//       public_id: (req, file) => Date.now().toString() + '-' + file.originalname.replace(/\.[^.]+$/, ''), // Remove file extension before adding the timestamp
//     },
//   });

// const upload = multer({ storage: storage });
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });
// const upload = multer({ storage: storage });
// const imageUrls = await Promise.all(
//     req.files.map(async (file) => {
//         return file.path; // The path is the Cloudinary URL
//     })
// );
// const imageUrls = req.files.map(file => "https://easlycars-server.vercel.app/" + file.path);

const storage = multer.memoryStorage();
const upload = multer({ storage });

async function AddCar(req, res) {
    try {
        const { location, fuel, model, year, make, price, description, distance, transmission, cardoors, startdate, enddate, features, type, carseat, positionlat, positionlng } = req.body;
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decoded.id;
        const imageUrls = [];
        for (const file of req.files) {
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ folder: 'car_photos' }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }).end(file.buffer);
            });
            imageUrls.push(result.secure_url);
        }
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
                doors: parseInt(cardoors),
                startTripDate: startdate,
                endTripDate: enddate,
                carSeats: parseInt(carseat),
                userId: userId,
                positionlat: parseFloat(positionlat),
                positionlang: parseFloat(positionlng)
            },
        });
        if (!car) {
            return res.status(400).json({ error: "Car not added" });
        }
        return setTimeout(() => {
            res.status(200).json({ message: "Car added to your list" });
        }, 1000)
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Unauthorized" });
        } else {
            console.log(error)
            res.status(500).json({ error: 'Server Error' });
        }
    }
}
// async function UpdateCar(req, res) {
//     try {
//         const { location, type, model, year, fuel, make, price, description, distance, transmission, maxtrip, mintrip, features, carseat, deletedImages, newPhotos } = req.body;
//         const token = req.headers.authorization.split(' ')[1];
//         const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         const userId = decoded.id;
//         // const newPhotosAdded = req.files.map(file => "https://easlycars-server.vercel.app/" + file.path);
//         const newPhotosAdded = await Promise.all(
//             req.files.map(async (file) => {
//                 return file.path;
//             })
//         )
//         let updatedImageUrls = []
//         let car = await prisma.car.findUnique({
//             where: {
//                 userId: userId,
//                 id: req.params.carId,
//             },
//         });
//         if (!car) {
//             return res.status(404).json({ error: "Car not found" });
//         }

//         if (deletedImages && deletedImages.length > 0) {
//             updatedImageUrls = car.imageUrls.filter(url => !deletedImages.includes(url));

//             const carupdated = await prisma.car.update({
//                 where: {
//                     userId: userId,
//                     id: req.params.carId,
//                 },
//                 data: {
//                     location: {
//                         set: location
//                     },
//                     model: {
//                         set: model
//                     },
//                     make: {
//                         set: make
//                     },
//                     features: {
//                         set: features
//                     },
//                     year: {
//                         set: parseInt(year)
//                     },
//                     price: {
//                         set: parseFloat(price)
//                     },
//                     description: {
//                         set: description
//                     },
//                     distance: {
//                         set: distance
//                     },
//                     transmission: {
//                         set: transmission
//                     },
//                     maxTrip: {
//                         set: parseInt(maxtrip)
//                     },
//                     minTrip: {
//                         set: parseInt(mintrip)
//                     },
//                     carSeats: {
//                         set: parseInt(carseat)
//                     },
//                     Type: {
//                         set: type,
//                     },
//                     fuel: {
//                         set: fuel,
//                     },
//                     imageUrls: {
//                         set: updatedImageUrls
//                     }
//                 }
//             });
//             if (carupdated) {
//                 res.status(200).json({ message: "Car updated" });
//             } else {
//                 res.status(400).json({ error: "Car not updated" });
//             }
//             // deletedImages.forEach(url => {
//             //     const filename = path.basename(url.replace(/\\/g, '/'));
//             //     const filePath = path.join('uploads', filename)
//             //     fs.unlink(filePath, (err) => {
//             //         if (err) {
//             //             console.error("Error deleting file:", err);
//             //         } else {
//             //             console.log("File deleted successfully");
//             //         }
//             //     });
//             // });
//             try {
//                 const deletePromises = deletedImages.map(async (url) => {
//                     const publicId = url.split('/').pop().split('.')[0];
//                     try {
//                       await cloudinary.uploader.destroy(`uploads/${publicId}`);
//                       console.log(`Image ${publicId} deleted successfully`);
//                     } catch (error) {
//                       console.error(`Error deleting image ${publicId}:`, error);
//                     }
//                   });
//                   await Promise.all(deletePromises);
//             } catch (error) {
//                 console.error("Error deleting images:", error);
//             }

//         } else
//             if (newPhotosAdded && newPhotosAdded.length > 0) {
//                 updatedImageUrls = [...car.imageUrls, ...newPhotosAdded];
//                 const carupdated = await prisma.car.update({
//                     where: {
//                         userId: userId,
//                         id: req.params.carId,
//                     },
//                     data: {
//                         location: {
//                             set: location
//                         },
//                         model: {
//                             set: model
//                         },
//                         make: {
//                             set: make
//                         },
//                         features: {
//                             set: features
//                         },
//                         year: {
//                             set: parseInt(year)
//                         },
//                         price: {
//                             set: parseFloat(price)
//                         },
//                         description: {
//                             set: description
//                         },
//                         distance: {
//                             set: distance
//                         },
//                         transmission: {
//                             set: transmission
//                         },
//                         maxTrip: {
//                             set: parseInt(maxtrip)
//                         },
//                         minTrip: {
//                             set: parseInt(mintrip)
//                         },
//                         carSeats: {
//                             set: parseInt(carseat)
//                         },
//                         Type: {
//                             set: type,
//                         },
//                         fuel: {
//                             set: fuel,
//                         },
//                         imageUrls: {
//                             set: updatedImageUrls
//                         }
//                     }
//                 });
//                 if (carupdated) {
//                     res.status(200).json({ message: "Car updated" });
//                 } else {
//                     res.status(400).json({ error: "Car not updated" });
//                 }
//             } else {
//                 const carupdated = await prisma.car.update({
//                     where: {
//                         userId: userId,
//                         id: req.params.carId,
//                     },
//                     data: {
//                         location: {
//                             set: location
//                         },
//                         model: {
//                             set: model
//                         },
//                         make: {
//                             set: make
//                         },
//                         features: {
//                             set: features
//                         },
//                         year: {
//                             set: parseInt(year)
//                         },
//                         price: {
//                             set: parseFloat(price)
//                         },
//                         description: {
//                             set: description
//                         },
//                         distance: {
//                             set: distance
//                         },
//                         transmission: {
//                             set: transmission
//                         },
//                         maxTrip: {
//                             set: parseInt(maxtrip)
//                         },
//                         minTrip: {
//                             set: parseInt(mintrip)
//                         },
//                         carSeats: {
//                             set: parseInt(carseat)
//                         },
//                         Type: {
//                             set: type,
//                         },
//                         fuel: {
//                             set: fuel,
//                         }
//                     }
//                 });
//                 if (carupdated) {
//                     res.status(200).json({ message: "Car updated" });
//                 } else {
//                     res.status(400).json({ error: "Car not updated" });
//                 }
//             }

//     } catch (error) {
//         if (error.name === 'JsonWebTokenError') {
//             return res.status(401).json({ error: "Unauthorized" });
//         } else {
//             console.error(error);
//             res.status(500).json({ error: 'Server Error' });
//         }
//     }
// }
async function UpdateCar(req, res) {
    try {
        const { location, type, model, year, fuel, make, price, description, distance, transmission, maxtrip, mintrip, features, carseat, deletedImages, newPhotos, doors, startTripDate, endTripDate, positionlat, positionlng } = req.body;
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decoded.id;

        const newPhotosAdded = await Promise.all(
            req.files.map(async (file) => {
                const result = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream({ folder: 'car_photos' }, (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }).end(file.buffer);
                });
                return result.secure_url;
            })
        );

        let updatedImageUrls = [];
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

            // Delete images from Cloudinary
            const deletePromises = deletedImages.map(async (url) => {
                const publicId = url.split('/').pop().split('.')[0];
                try {
                    await cloudinary.uploader.destroy(`car_photos/${publicId}`);
                    console.log(`Image ${publicId} deleted successfully`);
                } catch (error) {
                    console.error(`Error deleting image ${publicId}:`, error);
                }
            });
            await Promise.all(deletePromises);
        } else {
            updatedImageUrls = car.imageUrls;
        }

        if (newPhotosAdded && newPhotosAdded.length > 0) {
            updatedImageUrls = [...updatedImageUrls, ...newPhotosAdded];
        }

        const carupdated = await prisma.car.update({
            where: {
                userId: userId,
                id: req.params.carId,
            },
            data: {
                location: {
                    set: location,
                },
                model: {
                    set: model,
                },
                make: {
                    set: make,
                },
                features: {
                    set: features,
                },
                year: {
                    set: parseInt(year),
                },
                price: {
                    set: parseFloat(price),
                },
                description: {
                    set: description,
                },
                distance: {
                    set: distance,
                },
                transmission: {
                    set: transmission,
                },
                maxTrip: {
                    set: parseInt(maxtrip),
                },
                minTrip: {
                    set: parseInt(mintrip),
                },
                carSeats: {
                    set: parseInt(carseat),
                },
                Type: {
                    set: type,
                },
                fuel: {
                    set: fuel,
                },
                imageUrls: {
                    set: updatedImageUrls,
                },
                doors: {
                    set: parseInt(doors)
                },
                startTripDate: {
                    set: startTripDate
                },
                endTripDate: {
                    set: endTripDate
                },
                positionlat: {
                    set: parseFloat(positionlat)
                },
                positionlang: {
                    set: parseFloat(positionlng)
                }
            },
        });

        if (carupdated) {
            res.status(200).json({ message: "Car updated" });
        } else {
            res.status(400).json({ error: "Car not updated" });
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
        const { days, location, sort, type, minprice, maxprice, transmission, make, features, fueltype, seats, startDate, endDate } = req.query;
        let cars = await prisma.car.findMany();
        // Filter by days and location if provided
        if (location) {
            cars = cars.filter(car => car.location.toLocaleLowerCase() === location);
        }

        // Sort by price if provided and valid
        if (sort && (sort.toLowerCase() === "high" || sort.toLowerCase() === "low")) {
            cars.sort((a, b) => sort.toLowerCase() === "high" ? b.price - a.price : a.price - b.price);
        }

        // Sort by creation date if provided and valid
        if (sort && (sort.toLowerCase() === "oldest" || sort.toLowerCase() === "newest")) {
            cars.sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return sort.toLowerCase() === "oldest" ? dateA - dateB : dateB - dateA;
            });
        }

        // Filter by type if provided and not null
        if (type && type.toLowerCase() !== "all") {
            cars = cars.filter(car => car.Type.toLowerCase() === type.toLowerCase());
        }

        // filter by price 
        if (minprice && maxprice) {
            cars = cars.filter(car => car.price >= minprice && car.price <= maxprice);
        }

        // Filter by transmission if provided
        if (transmission) {
            cars = cars.filter(car => car.transmission.toLowerCase() === transmission.toLowerCase());
        }

        // Filter by make if provided
        if (make) {
            const makeLower = make.toLowerCase();
            cars = cars.filter(car => car.make.toLowerCase().includes(makeLower));
        }

        //Filter by features if provided
        const featuresArray = features ? features.split(',') : [];
        if (featuresArray.length > 0) {

            cars = cars.filter(car => {
                const carFeatures = car.features.map(feature => feature.split(':')[0]);
                return featuresArray.every(feature => carFeatures.includes(feature));
            });
        }

        // Filter cars by fuel type
        if (fueltype) {
            cars = cars.filter(car => car.fuel.toLowerCase() === fueltype.toLowerCase());
        }

        // Filter cars by number of seats
        if (seats) {
            if (seats.toLowerCase() === "more") {
                const minSeats = 5;
                cars = cars.filter(car => car.carSeats > minSeats);
            } else {
                cars = cars.filter(car => car.carSeats == parseInt(seats));
            }
        }

        // Filter cars by availability dates
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            // console.log(start,end)
            cars = cars.filter(car => {
                const carStartDate = new Date(car.startTripDate);
                const carEndDate = new Date(car.endTripDate);
                return (carStartDate >= start && carEndDate <= end) ||
                    (carStartDate <= start && carEndDate >= start) ||
                    (carStartDate <= end && carEndDate >= end);
            });
        }


        // Add isSaved property to each car if user is authenticated
        if (token) {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const userId = decoded.id;

            const favorites = await prisma.favorite.findMany({
                where: { userId },
            });

            const savedStatusMap = {};
            favorites.forEach(favorite => {
                savedStatusMap[favorite.carId] = true;
            });

            cars = cars.map(car => ({
                ...car,
                isSaved: savedStatusMap[car.id] || false,
            }));
        }
        return setTimeout(() => {
            res.status(200).json(cars);
        }, 1000)
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
        const { days, location, sort, type, minprice, maxprice, transmission, make, features, fueltype, seats } = req.query;
        let cars = await prisma.car.findMany();
        // Filter by days and location if provided
        if (location) {
            cars = cars.filter(car => car.location.toLocaleLowerCase() === location);
        }

        // Sort by price if provided and valid
        if (sort && (sort.toLowerCase() === "high" || sort.toLowerCase() === "low")) {
            cars.sort((a, b) => sort.toLowerCase() === "high" ? b.price - a.price : a.price - b.price);
        }

        // Sort by creation date if provided and valid
        if (sort && (sort.toLowerCase() === "oldest" || sort.toLowerCase() === "newest")) {
            cars.sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return sort.toLowerCase() === "oldest" ? dateA - dateB : dateB - dateA;
            });
        }

        // Filter by type if provided and not null
        if (type && type.toLowerCase() !== "all") {
            cars = cars.filter(car => car.Type.toLowerCase() === type.toLowerCase());
        }

        // filter by price 
        if (minprice && maxprice) {
            cars = cars.filter(car => car.price >= minprice && car.price <= maxprice);
        }

        // Filter by transmission if provided
        if (transmission) {
            cars = cars.filter(car => car.transmission.toLowerCase() === transmission.toLowerCase());
        }

        // Filter by make if provided
        if (make) {
            cars = cars.filter(car => car.make.toLowerCase() === make.toLowerCase());
        }

        //Filter by features if provided
        const featuresArray = features ? features.split(',') : [];
        if (featuresArray.length > 0) {

            cars = cars.filter(car => {
                const carFeatures = car.features.map(feature => feature.split(':')[0]);
                return featuresArray.every(feature => carFeatures.includes(feature));
            });
        }

        // Filter cars by fuel type
        if (fueltype) {
            cars = cars.filter(car => car.fuel.toLowerCase() === fueltype.toLowerCase());
        }

        // Filter cars by number of seats
        if (seats) {
            if (seats.toLowerCase() === "more") {
                const minSeats = 5;
                cars = cars.filter(car => car.carSeats > minSeats);
            } else {
                cars = cars.filter(car => car.carSeats == parseInt(seats));
            }
        }
        setTimeout(() => {
            res.status(200).json(cars);
        }, 500)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
}
async function GetCarsUser(req, res) {
    try {
        const { sort, car } = req.query;
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decoded.id;
        let cars = await prisma.car.findMany({
            where: {
                userId: userId,
            },
        });
        // Sort by price if provided and valid
        if (sort && (sort.toLowerCase() === "high" || sort.toLowerCase() === "low")) {
            cars.sort((a, b) => sort.toLowerCase() === "high" ? b.price - a.price : a.price - b.price);
        }

        // sort by model or year or make
        if (car) {
            const carInt = parseInt(car, 10);
            cars = cars.filter(c =>
                c.make.toLowerCase().includes(car.toLowerCase()) ||
                c.model.toLowerCase().includes(car.toLowerCase()) ||
                (!isNaN(carInt) && c.year === carInt)
            );
        }

        // Sort by creation date if provided and valid
        if (sort && (sort.toLowerCase() === "oldest" || sort.toLowerCase() === "newest")) {
            cars.sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return sort.toLowerCase() === "oldest" ? dateA - dateB : dateB - dateA;
            });
        }
        if (!cars) {
            return res.status(404).json({ error: "Car not found" });
        }
        setTimeout(() => {
            res.status(200).json(cars);
        }, 500)
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
        setTimeout(() => {
            res.status(200).json(obj);
        }, 500)
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

        // Delete associated Favorite records
        await prisma.favorite.deleteMany({
            where: {
                carId: carId,
            },
        });

        // Delete associated Reservation records
        await prisma.reservation.deleteMany({
            where: {
                carId: carId,
            },
        });


        // if (car.imageUrls && car.imageUrls.length > 0) {
        //     car.imageUrls.forEach(url => {
        //         const filename = path.basename(url.replace(/\\/g, '/'));
        //         const filePath = path.join('uploads', filename)
        //         fs.unlink(filePath, (err) => {
        //             if (err) {
        //                 console.error("Error deleting file:", err);
        //             }
        //         });
        //     });
        // }
        // if (car.imageUrls && car.imageUrls.length > 0) {
        //     for (const url of car.imageUrls) {
        //         try {
        //             // Extract public ID from the Cloudinary URL
        //             const publicId = url.match(/\/v\d+\/([^/]+)\//)[1];
        //             await cloudinary.uploader.destroy(publicId);
        //             console.log(`Image with public ID ${publicId} deleted from Cloudinary.`);
        //         } catch (error) {
        //             console.error("Error deleting image from Cloudinary:", error);
        //         }
        //     }
        // }
        if (car.imageUrls && car.imageUrls.length > 0) {
            const deletePromises = car.imageUrls.map(async (url) => {
                // Extract public ID from the URL
                const publicId = url.split('/').pop().split('.')[0]; // Adjust this if your URL format is different
                try {
                    await cloudinary.uploader.destroy(`car_photos/${publicId}`);
                    console.log(`Image ${publicId} deleted successfully from Cloudinary.`);
                } catch (error) {
                    console.error(`Error deleting image ${publicId} from Cloudinary:`, error);
                }
            });
            await Promise.all(deletePromises);
        }

        // Delete the car
        await prisma.car.delete({
            where: {
                userId: userId,
                id: carId,
            },
        });

        return setTimeout(() => {
            res.status(200).json({ message: "Car deleted" });
        }, 1000)
    } catch (e) {
        if (e.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Unauthorized" });
        } else {
            console.error(e);
            res.status(500).json({ error: 'Server Error' });
        }
    }
}
async function GetAllCarsByMakeAuth(req, res) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        let cars;

        if (req.query.make) {
            const make = req.query.make.toLowerCase().trim();
            cars = await prisma.car.findMany({
                where: {
                    make: {
                        contains: make.replace(/-/g, ''),
                        mode: 'insensitive'
                    }
                }
            });
            if (cars.length === 0) {
                return res.status(404).json({ message: "There are no cars with the given make" });
            }
        }

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
async function GetAllCarsByMakeunAuth(req, res) {

    try {
        let cars;
        if (req.query.make) {
            const make = req.query.make.toLowerCase().trim();
            cars = await prisma.car.findMany({
                where: {
                    make: {
                        contains: make.replace(/-/g, ''),
                        mode: 'insensitive'
                    }
                }
            });
            if (cars.length === 0) {
                return res.status(404).json({ message: "There are no cars with the given make" });
            } else {
                res.status(200).json(cars);
            }
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }

}
async function GetAllCarsByDestinataionunAuth(req, res) {

    try {
        let cars;
        if (req.query.destination) {
            const destination = req.query.destination.toLowerCase().trim();
            cars = await prisma.car.findMany({
                where: {
                    location: {
                        contains: destination.replace(/-/g, ''),
                        mode: 'insensitive'
                    }
                }
            });
            if (cars.length === 0) {
                return res.status(404).json({ message: "There are no cars with the given location" });
            } else {
                res.status(200).json(cars);
            }
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }

}
async function GetAllCarsByDestinataionAuth(req, res) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        let cars;

        if (req.query.destination) {
            const destination = req.query.destination.toLowerCase().trim();
            cars = await prisma.car.findMany({
                where: {
                    location: {
                        contains: destination.replace(/-/g, ''),
                        mode: 'insensitive'
                    }
                }
            });
            if (cars.length === 0) {
                return res.status(404).json({ message: "There are no cars with the given location" });
            }
        }

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


export { AddCar, upload, GetCarsUser, GetaUserCarUnauth, GetCarAuth, UpdateCar, GetAllCars, GetAllCarsUnauth, DeleteCars, GetAllCarsByMakeAuth, GetAllCarsByMakeunAuth, GetAllCarsByDestinataionAuth, GetAllCarsByDestinataionunAuth };
