import express from 'express';
import worldRouter from './routes/worldrouter.mjs';
import worldGamesRouter from './routes/worldgamesrouter.mjs';
import worldGeoJsonRouter from './routes/worldgeojsonrouter.mjs';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

/**
 * Express application setup for serving static files and handling API routes.
 *
 * - Serves static files from the `../client/dist` directory.
 * - Routes API requests for country data and country games data.
 * - Handles 404 errors for any undefined routes.
 *
 * @const {Express} app - The initialized Express application.
 */
const app = express();

// Middleware for serving static files
app.use(express.static('../client/dist'));

app.use('/api/countries', worldRouter);
app.use('/api/countries-games', worldGamesRouter);
app.use('/api/countries-geojson', worldGeoJsonRouter);

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for WorldJson',
    version: '1.0.0',
  },
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.mjs'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));




app.use((req, res) => {
  res.status(404).send('Sorry, can\'t find that!');
});

export default app;
