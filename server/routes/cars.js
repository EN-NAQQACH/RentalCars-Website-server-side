
import { Router } from 'express';
const router = Router();
import dotenv from 'dotenv';
dotenv.config();
import { AddCar,upload,GetCarsUser,GetaUserCarUnauth,GetCarAuth,UpdateCar,GetAllCars,GetAllCarsUnauth,DeleteCars,GetAllCarsByMakeAuth,GetAllCarsByMakeunAuth,GetAllCarsByDestinataionAuth,GetAllCarsByDestinataionunAuth} from '../controllers/cars.js';


/**
 * @swagger
 * /api/cars/addcar:
 *   post:
 *     summary: Add a new car
 *     tags: [Cars]
 *     description: Add a new car to the user's list
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: string
 *               fuel:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: integer
 *               make:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               distance:
 *                 type: string
 *               transmission:
 *                 type: string
 *               cardoors:
 *                 type: integer
 *               startdate:
 *                 type: string
 *               enddate:
 *                 type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               type:
 *                 type: string
 *               carseat:
 *                 type: integer
 *               positionlat:
 *                 type: number
 *               positionlng:
 *                 type: number
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Car added to your list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Car not added
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */

router.post('/addcar', upload.array('photos'), AddCar);
/**
 * @swagger
 * /api/cars/updatecar/{carId}:
 *   put:
 *     summary: Update car details
 *     tags: [Cars]
 *     description: Update the details of an existing car
 *     parameters:
 *       - name: carId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: string
 *               fuel:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: integer
 *               make:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               distance:
 *                 type: string
 *               transmission:
 *                 type: string
 *               cardoors:
 *                 type: integer
 *               startdate:
 *                 type: string
 *               enddate:
 *                 type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               type:
 *                 type: string
 *               carseat:
 *                 type: integer
 *               deletedImages:
 *                 type: array
 *                 items:
 *                   type: string
 *               newPhotos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               maxtrip:
 *                 type: integer
 *               mintrip:
 *                 type: integer
 *               positionlat:
 *                 type: number
 *               positionlng:
 *                 type: number
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Car updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Car not updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Car not found
 *       500:
 *         description: Server Error
 */

router.put('/updatecar/:carId',upload.array('photos'), UpdateCar);
/**
 * @swagger
 * /api/cars/delete/car/{carId}:
 *   delete:
 *     summary: Delete a car
 *     tags: [Cars]
 *     description: Delete a car from the user's list
 *     parameters:
 *       - name: carId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the car to be deleted
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Car deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating successful deletion
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message indicating authorization error
 *       404:
 *         description: Car not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message indicating the car was not found
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: A message indicating a server error
 */

router.delete('/delete/car/:carId',DeleteCars);
/**
 * @swagger
 * /api/cars/getcar:
 *   get:
 *     summary: Get cars for authenticated user
 *     tags: [Cars]
 *     description: Retrieve cars added by the authenticated user
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort cars by price (high or low), creation date (newest or oldest)
 *       - in: query
 *         name: car
 *         schema:
 *           type: string
 *         description: Filter cars by make, model, or year
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cars retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: No cars found for the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

router.get('/getcar', GetCarsUser);
/**
 * @swagger
 * /api/cars/getusercar/{carId}:
 *   get:
 *     summary: Get a car and its owner for authenticated user
 *     tags: [Cars]
 *     description: Retrieve car details and its owner's information with authentication
 *     parameters:
 *       - in: path
 *         name: carId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the car to retrieve
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Car and owner retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarAndOwner'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Car not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

router.get('/getusercar/:carId', GetCarAuth);
/**
 * @swagger
 * /api/cars/getcarunauth/{carId}:
 *   get:
 *     summary: Get a car and its owner for unauthenticated user
 *     tags: [Cars]
 *     description: Retrieve car details and its owner's information without authentication
 *     parameters:
 *       - in: path
 *         name: carId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the car to retrieve
 *     responses:
 *       200:
 *         description: Car and owner retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarAndOwner'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Car not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

router.get('/getcarunauth/:carId', GetaUserCarUnauth);
/**
 * @swagger
 * /api/cars/getallcars:
 *   get:
 *     summary: Get all cars for authenticated user
 *     tags: [Cars]
 *     description: Retrieve all cars with optional filters and sorting for authenticated user
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *         description: Number of days for the trip
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Location for the trip
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort cars by price (high or low), creation date (newest or oldest)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Type of car (e.g., sedan, SUV)
 *       - in: query
 *         name: minprice
 *         schema:
 *           type: number
 *         description: Minimum price of the car
 *       - in: query
 *         name: maxprice
 *         schema:
 *           type: number
 *         description: Maximum price of the car
 *       - in: query
 *         name: transmission
 *         schema:
 *           type: string
 *         description: Transmission type of the car
 *       - in: query
 *         name: make
 *         schema:
 *           type: string
 *         description: Make of the car
 *       - in: query
 *         name: features
 *         schema:
 *           type: string
 *         description: Features of the car (comma-separated list)
 *       - in: query
 *         name: fueltype
 *         schema:
 *           type: string
 *         description: Fuel type of the car
 *       - in: query
 *         name: seats
 *         schema:
 *           type: string
 *         description: Number of seats in the car (or "more" for cars with more than 5 seats)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for trip availability
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for trip availability
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cars retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

router.get('/getallcars',GetAllCars);
/**
 * @swagger
 * /api/cars/getallcarsunauth:
 *   get:
 *     summary: Get all cars for unauthenticated user
 *     tags: [Cars]
 *     description: Retrieve all cars with optional filters and sorting for unauthenticated user
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Location for the trip
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort cars by price (high or low), creation date (newest or oldest)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Type of car (e.g., sedan, SUV)
 *       - in: query
 *         name: minprice
 *         schema:
 *           type: number
 *         description: Minimum price of the car
 *       - in: query
 *         name: maxprice
 *         schema:
 *           type: number
 *         description: Maximum price of the car
 *       - in: query
 *         name: transmission
 *         schema:
 *           type: string
 *         description: Transmission type of the car
 *       - in: query
 *         name: make
 *         schema:
 *           type: string
 *         description: Make of the car
 *       - in: query
 *         name: features
 *         schema:
 *           type: string
 *         description: Features of the car (comma-separated list)
 *       - in: query
 *         name: fueltype
 *         schema:
 *           type: string
 *         description: Fuel type of the car
 *       - in: query
 *         name: seats
 *         schema:
 *           type: string
 *         description: Number of seats in the car (or "more" for cars with more than 5 seats)
 *     responses:
 *       200:
 *         description: Cars retrieved successfully
*/
router.get('/getallcarsunauth', GetAllCarsUnauth);
/**
 * @swagger
 * /api/cars/getallcarsbymake:
 *   get:
 *     summary: Get all cars by make for authenticated user
 *     tags: [Cars]
 *     description: Retrieve all cars with the specified make for authenticated user
 *     parameters:
 *       - in: query
 *         name: make
 *         schema:
 *           type: string
 *         description: Make of the car
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cars retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       404:
 *         description: No cars found with the given make.
 *       500:
 *         description: Internal server error.
 */
router.get('/getallcarsbymake/', GetAllCarsByMakeAuth);
/**
 * @swagger
 * /api/cars/getallcarsbymakeunauth:
 *   get:
 *     summary: Get all cars by make for unauthenticated user
 *     tags: [Cars]
 *     description: Retrieve all cars with the specified make for unauthenticated user
 *     parameters:
 *       - in: query
 *         name: make
 *         schema:
 *           type: string
 *         description: Make of the car
 *     responses:
 *       200:
 *         description: Cars retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: No cars found with the given make.
 *       500:
 *         description: Internal server error.
 */
router.get('/getallcarsbymakeunauth/', GetAllCarsByMakeunAuth);
/**
 * @swagger
 * /api/cars/getallcarsbydestination:
 *   get:
 *     summary: Get all cars by destination for authenticated user
 *     tags: [Cars]
 *     description: Retrieve all cars with the specified destination for authenticated user
 *     parameters:
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *         description: Destination of the car
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cars retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       404:
 *         description: No cars found with the given destination.
 *       500:
 *         description: Internal server error.
 */

router.get('/getallcarsbydestination/', GetAllCarsByDestinataionAuth);
/**
 * @swagger
 * /api/cars/getallcarsbydestinationunauth:
 *   get:
 *     summary: Get all cars by destination for unauthenticated user
 *     tags: [Cars]
 *     description: Retrieve all cars with the specified destination for unauthenticated user
 *     parameters:
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *         description: Destination of the car
 *     responses:
 *       200:
 *         description: Cars retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: No cars found with the given destination.
 *       500:
 *         description: Internal server error.
 */

router.get('/getallcarsbydestinationunauth/', GetAllCarsByDestinataionunAuth);
// router.post('/addcar',AddCar);
export default router;