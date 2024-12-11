import express from 'express';
import { 
  getAllGamesData,
  getCountryGamesData,
  getCountryGameFilter 
} from '../controllers/worldgamescontroller.mjs';

/**
 * @module worldGamesRouter
 * 
 * This module defines routers for handling game-related requests associated with countries.
 */
const router = express.Router();
/**
 * @swagger
 * /api/countries-games/:
 *   get:
 *     summary: Retrieve all games data
 *     description: Fetches data for all games related to countries.
 *     responses:
 *       200:
 *         description: A list of all games data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', getAllGamesData);

/**
 * @swagger
 * /api/countries-games/detail/{countryName}:
 *   get:
 *     summary: Retrieve game data for a specific country
 *     description: Fetches game data related to a specified country.
 *     parameters:
 *       - in: path
 *         name: countryName
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the country
 *     responses:
 *       200:
 *         description: Game data for the specified country
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/detail/:countryName', getCountryGamesData);

/**
 * @swagger
 * /api/countries-games/filter/{chart}/{name}:
 *   get:
 *     summary: Retrieve game data by filter
 *     description: Fetches game data based on specified chart and game name.
 *     parameters:
 *       - in: path
 *         name: chart
 *         required: true
 *         schema:
 *           type: string
 *         description: The chart type to filter by
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the game to filter by
 *     responses:
 *       200:
 *         description: Filtered game data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/filter/:chart/:name', getCountryGameFilter );

export default router;
