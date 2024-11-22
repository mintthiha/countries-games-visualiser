import { db } from '../db/db.mjs';

const cache = new Map();

export const getAllCountriesGeoJson = async (req, res) => {
  const key = 'geoJsonCountries';

  if (!cache.has(key) || cache.get(key).expires < Date.now()) {
    try {
      await db.connect('WEB_DEVELOPMENT_IV_PROJECT', 'GEOJSON_COUNTRY_DATA');
      const countries = await db.readAll();
      cache.set(key, { value: countries, expires: Date.now() + 3600000 }); 
    } catch (error) {
      console.error('Failed to retrieve countries GEOJSON:', error);
      res.status(500).json({ error: 'Failed to retrieve countries GEOJSON.' });
      return;
    }
  }

  res.json(cache.get(key).value);
};
