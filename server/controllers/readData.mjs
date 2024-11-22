import { db } from '../db/db.mjs';
//exported so i can clear it during test
export const cache = new Map();

export const AllCountries = async () => {
  const key = 'allCountries'; 

  if (!cache.has(key) || cache.get(key).expires < Date.now()) {
    await db.connect('WEB_DEVELOPMENT_IV_PROJECT', 'COUNTRY_DATA_2023');
    const countries = await db.readAll();
    cache.set(key, { value: countries, expires: Date.now() + 3600000 });
  }

  return cache.get(key).value;
};

export const AllGamesData = async () => {
  const key = 'countriesGamesData'; 

  if (!cache.has(key) || cache.get(key).expires < Date.now()) {
    await db.connect('WEB_DEVELOPMENT_IV_PROJECT', 'GAME_DATA_PER_COUNTRY');
    const countriesGamesData = await db.readAll();
    cache.set(key, { value: countriesGamesData, expires: Date.now() + 3600000 });
  }

  return cache.get(key).value;
};

