import { AllCountries } from './readData.mjs';


/**
 * Retrieves all countries from the database and responds with the data.
 *
 * This function connects to the database,
 * fetches all country records, and returns them in JSON format.
 * If an error occurs during the database operations,
 * it responds with a 500 status code and an error message.
 * 
 * @async
 * @function getAllCountries
 * 
 * @param {Object} req - The request object representing the HTTP request.
 * @param {Object} res - The response object used to send the HTTP response.
 */
export const getAllCountries = async (req, res) => {
  try {
    const countries = await AllCountries();
    res.json(countries);
  } catch (error) {
    console.error('Failed to retrieve countries:', error);
    res.status(500).json({ error: 'Failed to retrieve countries.' });
  }
};

/**
 * Retrieves details for a specific country based on the provided country name.
 *
 * This function connects to the database, fetches all country records, and searches for the country
 * that matches the given name.
 * It responds with the country details if found or a 404 error if not found.
 * 
 * @async
 * @function getCountryDetails
 * 
 * @param {Object} req - The request object representing the HTTP request, containing parameters.
 * @param {Object} res - The response object used to send the HTTP response.
 */
export const getCountryDetails = async (req, res) => {
  const { countryName } = req.params;

  try {
    const countries = await AllCountries();

    const country = countries.find(
      (c) => c.Country.toLowerCase() === countryName.toLowerCase()
    );

    if (country) {
      res.json(country);
    } else {
      res.status(404).json({ error: 'The country is not found. Try again!' });
    }
  } catch (error) {
    console.error('Failed to retrieve country details:', error);
    res.status(500).json({ error: 'Failed to retrieve country details.' });
  }
};

/**
 * Retrieves country data based on the provided filter.
 *
 * This function connects to the database,
 * fetches all countries records, and searches for the filter.
 * with the given country name.
 * It responds with the filter data if found or a 404 error if not found.
 * 
 * @async
 * @function getCountryGamesData
 * 
 * @param {Object} req - The request object representing the HTTP request, containing parameters.
 * @param {Object} res - The response object used to send the HTTP response.
 */

export const getCountryFilter = async (req, res) => {
  const filter = req.query.filter;
  try {
    const countries = await AllCountries();

    if (filter) {
      const filteredData = countries.map((country) => ({
        Country: country.Country,
        [filter]: country[filter]
      }));
      res.json(filteredData);
    }else {
      res.status(404).json({ error: 'The filter is not found. Try again!' });
    }
  } catch (error) {
    console.error('Failed to retrieve country details:', error);
    res.status(500).json({ error: 'Failed to retrieve country details.' });
  }
};

