import { MapContainer, TileLayer } from 'react-leaflet';
import CountryGeoJSON from './CountryGeoJSON';
import { useState, useEffect } from 'react';

const attribution = 
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

/**
 * Map component displaying a map with a GeoJSON overlay of country and game data.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.geoJsonData - GeoJSON data to display on the map.
 * @param {Object} props.gameData - Game-related data to display on the map.
 * @param {string} props.currentCountryFilter - Selected filter for country data.
 * @param {string} props.currentGameFilter - Selected filter for game data.
 *
 * @returns {JSX.Element} The rendered Map component with map layers.
 */
export default function Map({ geoJsonData, gameData, currentCountryFilter, currentGameFilter }) {
  const [mergedData, setMergedData] = useState([]);

  /**
   * Merges `gameData` into `geoJsonData` and updates the `mergedData` state.
   */
  useEffect(() => {
    if (geoJsonData && gameData) {
      const merged = geoJsonData.map((feature) => {
        const gameInfo = gameData.find((game) => game.Country === feature.properties.Country);
        const gameValue = gameInfo ? gameInfo.Value : 0;
        const gameUnit = gameInfo ? gameInfo.Unit : '';
        return {
          ...feature,
          properties: {
            ...feature.properties,
            Value: gameValue,
            Unit: gameUnit,
          },
        };
      });
      setMergedData(merged);
    }
  }, [geoJsonData, gameData]);

  return (
    <MapContainer
      center={[0, 0]}
      zoom={3}
      minZoom={3}
      maxBounds={[[-90, -180], [90, 180]]}
      style={{ height: '100vh', width: '100%' }}
      //makes the bounds fully solid, preventing the user from dragging outside the bounds
      maxBoundsViscosity={1}
    >
      <TileLayer
        attribution={attribution}
        url={tileUrl}
      />
      
      <CountryGeoJSON 
        mergedData={mergedData}
        currentCountryFilter={currentCountryFilter}
        currentGameFilter={currentGameFilter}
      />
    </MapContainer>
  );
}
