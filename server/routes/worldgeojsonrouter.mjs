import express from 'express';
import { getAllCountriesGeoJson } from '../controllers/worldgeojsoncontroller.mjs';

const router = express.Router();

/**
 * @swagger
 * /api/countries-geojson/:
 *   get:
 *     summary: Retrieve GeoJSON data for all countries
 *     description: Fetches GeoJSON data representing all countries.
 *     responses:
 *       200:
 *         description: A GeoJSON object containing data for all countries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   example: "FeatureCollection"
 *                 features:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: "Feature"
 *                       geometry:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             example: "Polygon"
 *                           coordinates:
 *                             type: array
 *                             items:
 *                               type: array
 *                               items:
 *                                 type: number
 *                       properties:
 *                         type: object
 *                         description: Additional properties for each country
 */
router.get('/', getAllCountriesGeoJson);

export default router;