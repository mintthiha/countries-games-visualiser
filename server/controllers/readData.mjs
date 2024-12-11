import { db } from '../db/db.mjs';
import cache from 'memory-cache';

//FOR TEST
export { cache };

export const AllCountries = async () => {
  const key = 'allCountries'; 
  const ActiveKey = cache.get('allCountries');
  if (!ActiveKey || cache.get(key).expires < Date.now()) {
    await db.connect('WEB_DEVELOPMENT_IV_PROJECT', 'COUNTRY_DATA_2023');
    const countries = await db.readAll();
    cache.put(key, { value: countries, expires: Date.now() + 3600000 });
  }

  return cache.get(key).value;
};

export const AllGamesData = async () => {
  const key = 'countriesGamesData'; 
  const ActiveKey = cache.get('countriesGamesData');
  if (!ActiveKey || cache.get(key).expires < Date.now()) {
    await db.connect('WEB_DEVELOPMENT_IV_PROJECT', 'GAME_DATA_PER_COUNTRY');
    const countriesGamesData = await db.readAll();
    cache.put(key, { value: countriesGamesData, expires: Date.now() + 3600000 });
  }

  return cache.get(key).value;
};

