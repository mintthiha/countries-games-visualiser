import { db } from '../db/db.mjs';
import cache from 'memory-cache';

export const getAllCountriesGeoJson = async (req, res) => {
  const key = 'geoJsonCountries';
  const ActiveKey = cache.get('geoJsonCountries');

  if (!ActiveKey || cache.get(key).expires < Date.now()) {
    try {
      await db.connect('WEB_DEVELOPMENT_IV_PROJECT', 'GEOJSON_COUNTRY_DATA');
      const countries = await db.readAll();
      cache.put(key, { value: countries, expires: Date.now() + 3600000 }); 
    } catch (error) {
      console.error('Failed to retrieve countries GEOJSON:', error);
      res.status(500).json({ error: 'Failed to retrieve countries GEOJSON.' });
      return;
    }
  }
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  res.json(cache.get(key).value);
};
