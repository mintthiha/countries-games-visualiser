import { MapContainer, TileLayer } from 'react-leaflet';
import CountryGeoJSON from './CountryGeoJSON';

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
  return (
    <MapContainer
      center={[0, 0]}
      zoom={3}
      minZoom={3}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        attribution={attribution}
        url={tileUrl}
      />
      
      <CountryGeoJSON 
        geoJsonData={geoJsonData} 
        gameData={gameData}
        currentCountryFilter={currentCountryFilter}
        currentGameFilter={currentGameFilter}
      />
    </MapContainer>
  );
}
