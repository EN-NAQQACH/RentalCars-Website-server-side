import { Router } from 'express';
const router = Router();
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();
import multer from 'multer';
import {Save,GetUserFavorites} from '../controllers/favorities.js'
/**
 * @swagger
 * /api/cars/save/{id}:
 *   post:
 *     summary: Save or unsave a car to favorites
 *     tags: [Favorites]
 *     description: Save or unsave a car to favorites for the authenticated user
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the car to save or unsave
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Car saved to or removed from favorites successfully
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       500:
 *         description: Internal server error.
 */
router.post('/save/:id',Save);
/**
 * @swagger
 * /api/cars/getuserfavorites:
 *   get:
 *     summary: Get user's favorite cars
 *     tags: [Favorites]
 *     description: Retrieve all cars saved in favorites for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favorites retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       500:
 *         description: Internal server error.
 */
router.get('/getuserfavorites',GetUserFavorites);

export default router ;