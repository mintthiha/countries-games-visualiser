import {db} from '../db/db.mjs';
import { readFileFromPath } from './util.mjs';

/**
 * This module and function seeds the database with country and game data by reading JSON files and
 * inserting them into the database collections.
 * 
 * Connects to two different collections in the database,
 * deletes any existing data, reads new data from JSON files,
 * and inserts the new data into the respective collections.
 *
 * @async
 */
(async () => {
  try {

    await db.connect('WEB_DEVELOPMENT_IV_PROJECT', 'COUNTRY_DATA_2023');
    const newWorldData = await readFileFromPath('../data/worldjson.json');
    await db.deleteMany({});
    const num = await db.createMany(newWorldData);
    console.log(`Inserted ${num} countries`);

    await db.connect('WEB_DEVELOPMENT_IV_PROJECT', 'GAME_DATA_PER_COUNTRY');
    const newGameData = await readFileFromPath('../data/GamesData.json');
    await db.deleteMany({});
    const num2 = await db.createMany(newGameData);
    console.log(`Inserted ${num2} games`);

    await db.connect('WEB_DEVELOPMENT_IV_PROJECT', 'GEOJSON_COUNTRY_DATA');
    const geoJsonData = await readFileFromPath('../data/countries.geo.json');
    await db.deleteMany({});
    const num3 = await db.createMany(geoJsonData.features);
    console.log(`Inserted ${num3} GeoJSON features`);
  } catch (e) {
    console.error('could not seed');
    console.dir(e);
  } finally {
    if (db) {
      db.close();
    }
    process.exit();
  }
})();