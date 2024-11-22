import 'leaflet/dist/leaflet.css';
import './Map.css';
import Panel from './Panel';
import Map from './Map';

/**
 * MapView component that combines a control panel and a map view.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.setView - Function to change the current view (e.g., 'world' or 'chart').
 * @param {Object} props.geoJsonData - GeoJSON data to be displayed on the map.
 * @param {Object} props.gameData - Game-related data to be used on the map.
 * @param {string} props.currentCountryFilter - The currently selected filter for country data.
 * @param {string} props.currentGameFilter - The currently selected filter for game data.
 * @param {Function} props.countryFilterHandler - Function to handle changes in the country filter.
 * @param {Function} props.gameFilterChartHandler - Function to handle changes in game type filter.
 * @param {Function} props.gameFilterTypeHandler - Function to handle changes in game content filter
 *
 * @returns {JSX.Element} The rendered MapView component.
 */
export default function MapView({ 
  setView, 
  geoJsonData, 
  gameData, 
  currentCountryFilter, 
  currentGameFilter, 
  countryFilterHandler, 
  gameFilterChartHandler, 
  gameFilterTypeHandler 
}) {
  return (
    <div className="ui-container">
      <Panel 
        setView={setView} 
        countryFilterButtonHandler={countryFilterHandler}
        gameFilterChartButtonHandler={gameFilterChartHandler}
        gameFilterTypeButtonHandler={gameFilterTypeHandler}
      />
      <Map 
        geoJsonData={geoJsonData}
        gameData={gameData}
        currentCountryFilter={currentCountryFilter} 
        currentGameFilter={currentGameFilter}
      />
    </div>
  );
}
