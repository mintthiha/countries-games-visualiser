import { useState, useEffect } from 'react';
import ChartView from './components/ChartView.jsx';
import MapView from './components/MapView.jsx';
import './App.css';

/**
 * Merges GeoJSON data with country details.
 *
 * @function mergeGeoJsonWithCountryDetails
 * @param {Array} geoData - Array of GeoJSON features representing countries.
 * @param {Array} detailsData - Array of country details to merge with GeoJSON data.
 * @returns {Array} - Array of merged GeoJSON features with additional country properties.
 */
const mergeGeoJsonWithCountryDetails = (geoData, detailsData) => {
  const detailsMap = detailsData.reduce((acc, country) => {
    acc[country.Country] = country;
    return acc;
  }, {});

  return geoData.map((geoCountry) => {
    const countryName = geoCountry.properties.name;
    const countryDetails = detailsMap[countryName];
    if (countryDetails) {
      geoCountry.properties = {
        ...countryDetails,
      };
    }
    return geoCountry;
  });
};

/**
 * Fetches GeoJSON and country details, then merges.
 * @param {String} filterCountry 
 * @param {Function} setGeoJsonData 
 * @returns 
 */
async function fetchCountryData(filterCountry, setGeoJsonData) {
  try {
    if(!filterCountry){
      return;
    }

    const countryFilterParam = filterCountry ? `filter=${filterCountry}` : '';
    const [geoResponse, detailsResponse] = await Promise.all([
      fetch(`/api/countries-geojson`),
      fetch(`/api/countries/filter?${countryFilterParam}`)
    ]);

    if (!geoResponse.ok || !detailsResponse.ok) {
      throw new Error('Error fetching country data!');
    }

    const geoData = await geoResponse.json();
    const detailsData = await detailsResponse.json();

    setGeoJsonData(mergeGeoJsonWithCountryDetails(geoData, detailsData));
  } catch (error) {
    console.error('Failed to fetch country data:', error);
  }
}

/**
 * Fetches data for games, and sets it to a variable.
 * @param {*} filterGamesChart 
 * @param {*} filterGamesType 
 * @param {*} setGameData 
 * @returns 
 */
async function fetchGameData(filterGamesChart, filterGamesType, setGameData) {
  if (!filterGamesChart || !filterGamesType) {
    // eslint-disable-next-line no-console
    console.log('Skipping fetch: both game filters are required.');
    setGameData([]);
    return;
  }

  try {
    const gamesFilterParam = `filter/${filterGamesChart}/${filterGamesType}`;
    const gamesResponse = await fetch(`/api/countries-games/${gamesFilterParam}`);

    if (!gamesResponse.ok) {
      throw new Error('Error fetching game data!');
    }

    const gamesData = await gamesResponse.json();
    setGameData(gamesData);
  } catch (error) {
    console.error('Failed to fetch game data:', error);
  }
}

/**
 * Main application component.
 *
 * The `App` component manages the application's main state and renders `MapView` or `ChartView`.
 * 
 * @component
 * @returns {JSX.Element} - The rendered UI of the application.
 */
function App() {
  const [view, setView] = useState('world');
  const [geoJsonData, setGeoJsonData] = useState([]);
  const [gameData, setGameData] = useState([]);
  const [filterCountry, setFilterCountry] = useState('Total tax rate');
  const [filterGamesChart, setFilterGamesChart] = useState('');
  const [filterGamesType, setFilterGamesType] = useState('');

  function handleCountryFilter(newCountryFilter){
    setFilterCountry(newCountryFilter);
  }

  function handleGameChartFilter(newGameFilter){
    setFilterGamesChart(newGameFilter);
  }

  function handleGameTypeFilter(newGameFilter){
    setFilterGamesType(newGameFilter);
  }

  useEffect(() => {
    fetchCountryData(filterCountry, setGeoJsonData);
  }, [filterCountry]);

  useEffect(() => {
    fetchGameData(filterGamesChart, filterGamesType, setGameData);
  }, [filterGamesChart, filterGamesType]);

  /**
   * Renders the appropriate view based on the `view` state.
   *
   * @function renderView
   * @returns {JSX.Element} - The `MapView` or `ChartView` component.
   */
  const renderView = () => {
    switch (view) {
    case 'world':
      return <MapView 
        setView={setView}
        geoJsonData={geoJsonData}
        gameData={gameData}
        currentCountryFilter={filterCountry}
        currentGameFilter={`${filterGamesChart} for ${filterGamesType}`}
        countryFilterHandler={handleCountryFilter}
        gameFilterChartHandler={handleGameChartFilter}
        gameFilterTypeHandler={handleGameTypeFilter}
      />;
    case 'chart':
      return <ChartView 
        setView={setView}
        geoJsonData={geoJsonData}
        gameData={gameData}
        currentCountryFilter={filterCountry}
        currentGameFilter={`${filterGamesChart} for ${filterGamesType}`} 
        countryFilterHandler={handleCountryFilter}
        gameFilterChartHandler={handleGameChartFilter}
        gameFilterTypeHandler={handleGameTypeFilter}
      />;
    default:
      return <MapView 
        setView={setView}
        geoJsonData={geoJsonData}
        gameData={gameData}
        currentCountryFilter={filterCountry}
        currentGameFilter={`${filterGamesChart} for ${filterGamesType}`}
        countryFilterHandler={handleCountryFilter}
        gameFilterChartHandler={handleGameChartFilter}
        gameFilterTypeHandler={handleGameTypeFilter}
      />;
    }
  };

  return (
    <div>
      <div className="content-container">
        {renderView()}
      </div>
    </div>
  );
}

export default App;
