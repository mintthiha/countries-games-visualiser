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

/**
 * @swagger
 * /api/countries-games/revenue:
 *   get:
 *     summary: Retrieve revenue data
 *     description: Placeholder route for retrieving revenue data (to be implemented).
 *     responses:
 *       200:
 *         description: Placeholder response indicating route is not implemented
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 to be implemented:
 *                   type: string
 *                   example: "to be implemented"
 */
router.get('/revenue', async (req, res) => {
  try {
    res.json({'to be imeplemented' : 'to be implemented'});

  } catch (error) {
    console.error('Failed to retrieve revenues:', error);
    res.status(500).json({ error: 'Failed to retrieve revenues.' });
  }
});

/**
 * @swagger
 * /api/countries-games/types:
 *   get:
 *     summary: Retrieve game types
 *     description: Placeholder route for retrieving game types (to be implemented).
 *     responses:
 *       200:
 *         description: Placeholder response indicating route is not implemented
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 to be implemented:
 *                   type: string
 *                   example: "to be implemented"
 */
router.get('/types', async (req, res) => {
  try {
    res.json({'to be imeplemented' : 'to be implemented'});

  } catch (error) {
    console.error('Failed to retrieve types:', error);
    res.status(500).json({ error: 'Failed to retrieve types.' });
  }
});

export default router;
