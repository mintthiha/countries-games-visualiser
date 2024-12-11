import { AllGamesData } from './readData.mjs';


/**
 * Retrieves all game data associated with countries from the database.
 *
 * This function connects to the database, fetches all game records,
 * and responds with the data in JSON format.
 * If an error occurs during the database operations,
 * it responds with a 500 status code and an error message.
 * 
 * @async
 * @function getAllGamesData
 * 
 * @param {Object} req - The request object representing the HTTP request.
 * @param {Object} res - The response object used to send the HTTP response.
 */
export const getAllGamesData = async (req, res) => {
  try {
    const countriesGamesData = await AllGamesData();
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.json(countriesGamesData);
  } catch (error) {
    console.error('Failed to retrieve countries games data:', error);
    res.status(500).json({ error: 'Failed to retrieve countries games data.' });
  }
};

/**
 * Retrieves game data for a specific country based on the provided country name.
 *
 * This function connects to the database,
 * fetches all game records, and searches for the games associated
 * with the given country name.
 * It responds with the country game data if found or a 404 error if not found.
 * 
 * @async
 * @function getCountryGamesData
 * 
 * @param {Object} req - The request object representing the HTTP request, containing parameters.
 * @param {Object} res - The response object used to send the HTTP response.
 */
export const getCountryGamesData = async (req, res) => {
  try {
    const { countryName } = req.params;
    const countries = await AllGamesData();

    const countryData = Object.values(countries).find(country => {
      return Array.isArray(country[countryName]);
    });

    if (countryData) {
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
      res.json(countryData);
    } else {
      res.status(404).json({ error: 'The country is not found. Try again!' });
    }
  } catch (error) {
    console.error('Failed to retrieve country details:', error);
    res.status(500).json({ error: 'Failed to retrieve country details.' });
  }
};

/**
 * Retrieves game data for a specific country based on the provided chart and name.
 *
 * This function connects to the database,
 * fetches all game records, and searches for the same chart and name
 * It responds with the country game data if found or a 404 error if not found.
 * 
 * @async
 * @function getCountryGamesData
 * 
 * @param {Object} req - The request object representing the HTTP request, containing parameters.
 * @param {Object} res - The response object used to send the HTTP response.
 */

export const getCountryGameFilter = async (req, res) => {
  try {
    const { chart, name } = req.params;

    const data = await AllGamesData(); 

    const filteredData = data.map(doc => {
      const countries = Object.keys(doc).filter(key => key !== '_id');
      const result = countries.map(country => {
        return doc[country].filter(entry => entry.Chart === chart && entry.Name === name);
      });

      return result.flat();  
    });
    const betterData = filteredData.flatMap(docs =>
      docs.map(d => ({
        Country: d.Region,
        Market: d.Market,
        Chart: d.Chart,
        Name: d.Name,
        Value: d[2023],
        Unit: d.Unit
      }))
    );
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.json(betterData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
};



