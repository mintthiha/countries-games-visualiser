import Panel from './Panel.jsx';
import './Panel.css';
import {Chart} from './Chart.jsx';

/**
 * Renders the ChartView component, which integrates
 * a map-based data panel and a chart visualization
 * for filtered country and game data.
 *
 * @param {Object} props - The props for the ChartView component.
 * @param {Function} props.setView - A callback function to update the view state.
 * @param {string} props.currentCountryFilter - The current country filter applied to data.
 * @param {Array} props.geoJsonData - Array of geographical data objects containing
 * country properties.
 * @param {Array} props.gameData - Array of game-related data objects.
 * @param {string} props.currentGameFilter - The current game filter applied to data.
 * @param {Function} props.countryFilterHandler - Callback function to handle country
 * filter changes.
 * @param {Function} props.gameFilterChartHandler - Callback function to handle game
 * filter for chart changes.
 * @param {Function} props.gameFilterTypeHandler - Callback function to handle game
 * filter type changes.
 *
 * @returns {JSX.Element} The rendered ChartView component.
 */
export function ChartView( { setView, currentCountryFilter, geoJsonData, gameData,
  currentGameFilter, countryFilterHandler, gameFilterChartHandler, gameFilterTypeHandler}) {
  const countriesData = [];
  if(geoJsonData.length !== 0 && gameData.length !== 0){
    geoJsonData.forEach(country => {
      gameData.forEach(gameCountry => {
        if(country.properties.Country === gameCountry.Country){
          const parts = gameCountry.Unit.toLowerCase().split(' ');
          const multiplier = parts[0];
          let realMultiplier = 0;
          if(multiplier === 'million'){
            realMultiplier = 1000000;
          }else if(multiplier === 'thousand'){
            realMultiplier = 1000;
          }else if(multiplier === 'billion'){
            realMultiplier = 1000000000;
          }else{
            realMultiplier = 1;
          }
          countriesData.push(
            {
              Country : gameCountry.Country,
              data1 : country.properties[currentCountryFilter.replace('25', '')],
              data2 : gameCountry.Value * realMultiplier
            }
          );
        }
      });
    });
  }

  return (
    <div>
      <div className="ui-container">
        <Panel 
          setView={setView} 
          countryFilterButtonHandler={countryFilterHandler}
          gameFilterChartButtonHandler={gameFilterChartHandler}
          gameFilterTypeButtonHandler={gameFilterTypeHandler}
        />
        <Chart
          data={countriesData} 
          filterCountryBy={currentCountryFilter}
          filterGamesBy={currentGameFilter}
        />
      </div>
    </div>
  );
}

export default ChartView;
