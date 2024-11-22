import express from 'express';
import {
  getAllCountries,
  getCountryDetails,
  getCountryFilter
} from '../controllers/worldcontroller.mjs';

/**
 * @module worldRouter
 * 
 * This module defines routers for handling country-related requests.
 */
const router = express.Router();

/**
 * @swagger
 * /api/countries:
 *   get:
 *     summary: Get all countries
 *     description: Retrieves a list of all countries.
 *     responses:
 *       200:
 *         description: A list of countries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Country:
 *                     type: string
 *                     description: The name of the country
 *                   Code:
 *                     type: string
 *                     description: The ISO code of the country
 *                   Region:
 *                     type: string
 *                     description: The region the country is located in
 *       500:
 *         description: Failed to retrieve countries
 */
router.get('/', getAllCountries);

/**
 * @swagger
 * /api/countries/detail/{countryName}:
 *   get:
 *     summary: Get details for a specific country
 *     description: Retrieves details of a country by its name.
 *     parameters:
 *       - in: path
 *         name: countryName
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the country
 *     responses:
 *       200:
 *         description: Country details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Country:
 *                   type: string
 *                   description: The name of the country
 *                 Code:
 *                   type: string
 *                   description: The ISO code of the country
 *                 Region:
 *                   type: string
 *                   description: The region the country is located in
 *                 Population:
 *                   type: integer
 *                   description: The population of the country
 *       404:
 *         description: The country is not found
 *       500:
 *         description: Failed to retrieve country details
 */
router.get('/detail/:countryName', getCountryDetails);

/**
 * @swagger
 * /api/countries/filter:
 *   get:
 *     summary: Get data for a specific country filter
 *     description: Retrieves country data for a specified filter.
 *     parameters:
 *       - in: query
 *         name: filter
 *         required: true
 *         schema:
 *           type: string
 *         description: The filter key to retrieve data for (e.g., GDP, Population).
 *     responses:
 *       200:
 *         description: Filtered country data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Country:
 *                     type: string
 *                     description: The name of the country
 *                   filter:
 *                     type: string
 *                     description: The filtered data for the specified filter key
 *       404:
 *         description: The filter is not found
 *       500:
 *         description: Failed to retrieve country filter data
 */
router.get('/filter/', getCountryFilter);


export default router;
