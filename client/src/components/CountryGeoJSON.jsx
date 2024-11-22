import { useEffect, useState, useCallback } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import './CountryGeoJSON.css';

/**
 * CountryGeoJSON component that displays GeoJSON data for countries on a Leaflet map.
 *
 * @param {Object} geoJsonData - The GeoJSON data for countries with various properties.
 * @param {Object} gameData - Additional game data linked to each country.
 * @param {string} currentCountryFilter - Filter for displaying specific country data.
 * @param {string} currentGameFilter - Filter for displaying specific game data.
 *
 * @returns {JSX.Element} - The rendered CountryGeoJSON component with interactive features.
 */
function CountryGeoJSON({ geoJsonData, gameData, currentCountryFilter, currentGameFilter }) {
  const map = useMap();
  const [infoControl, setInfoControl] = useState(null);
  const [grades, setGrades] = useState([]);
  const [gamesGrades, setGameGrades] = useState([]);
  const [mergedData, setMergedData] = useState([]);

  /**
   * Merges `gameData` into `geoJsonData` based on matching properties and sets `mergedData` state.
   */
  useEffect(() => {
    // Merge gameData into geoJsonData based on a matching property (e.g., country code or name)
    const merged = geoJsonData.map((feature) => {
      const gameInfo = gameData.find((game) => game.Country === feature.properties.Country);
      const gameValue = gameInfo ? gameInfo.Value : 0;
      const gameUnit = gameInfo ? gameInfo.Unit : '';
      return {
        ...feature,
        properties: {
          ...feature.properties,
          Value: gameValue,
          Unit: gameUnit
        },
      };
    });
    setMergedData(merged);
  }, [geoJsonData, gameData]);

  /**
   * Calculates dynamic grades for the country data based on `currentCountryFilter`.
   */
  useEffect(() => {
    if (mergedData && mergedData.length > 0) {
      const values = mergedData.map(feature => {
        let value = feature.properties[currentCountryFilter];
        
        if (typeof value === 'string') {
          // Remove '%' or '$' and commas, then parse as float
          value = value.replace(/[%$,]/g, '');
          return parseFloat(value) || 0;
        }
        
        return typeof value === 'number' ? value : null;
      }).filter(value => value !== null);
      if (values.length > 0) {
        setGrades(createDynamicGrades(values));
      } else {
        setGrades([0, 10, 25, 40, 55, 70, 90, 100]);
      }
    }
  }, [map, mergedData]);

  /**
   * Calculates dynamic grades for the game data and applies necessary unit conversions.
   */
  useEffect(() => {
    if (mergedData && mergedData.length > 0) {
      const values = mergedData.map(country => {
        let value = country.properties.Value;
        if(country.properties.Unit.includes('million')){
          value = value * 1000000;
        } else if(country.properties.Unit.includes('thousand')){
          value = value * 1000;
        } else if(country.properties.Unit.includes('billion')){
          value = value * 1000000000;
        }
        
        /**
         * Some data have NaN values, so we set them to 0 here.
         */
        if(isNaN(value)){
          value = 0;
        }

        return typeof value === 'number' ? value : 0;
      }).filter(value => value !== null);
      if (values.length > 0) {
        setGameGrades(createDynamicGrades(values));
      } else {
        setGameGrades([0, 10, 25, 40, 55, 70, 90, 100]);
      }
    }
  }, [map, mergedData]);

  /**
   * Returns a color based on country and game values.
   * 
   * @param {number} countryValue - The country's current filter value.
   * @param {number} gameValue - The game's current filter value.
   * @param {boolean} [legendMode=false] - If true, applies legend styling.
   * @returns {string} - The hex color for the feature.
   */

  const getColor = useCallback((countryValue, gameValue, legendMode = false) => {
    if(legendMode === false){
      /**
      * Modify only the first 2 values of the colour code (red)
      */
      const countryColor = countryValue > grades[6] ? '#FF00' :
        countryValue > grades[5] ? '#CC00' :
          countryValue > grades[4] ? '#9900' :
            countryValue > grades[3] ? '#7700' :
              countryValue > grades[2] ? '#5500' :
                countryValue > grades[1] ? '#3300' : '#1100';

      if(gameValue === 0){
        return countryColor + '00';
      }
      /**
       * Modify only the last 2 values of the colour code (blue)
       */
      
      const gameColorSuffix = gameValue > gamesGrades[6] ? 'FF' :
        gameValue > gamesGrades[5] ? 'CC' :
          gameValue > gamesGrades[4] ? '99' :
            gameValue > gamesGrades[3] ? '77' :
              gameValue > gamesGrades[2] ? '55' :
                gameValue > gamesGrades[1] ? '33' : '11';

      if(countryValue === 0){
        return '#0000' + gameColorSuffix;
      }
      /**
       * Combine both colours to make new colour
       */
      return countryColor + gameColorSuffix;
    } else {
      const gameColorSuffix = gameValue > gamesGrades[6] ? 'FF' :
        gameValue > gamesGrades[5] ? 'CC' :
          gameValue > gamesGrades[4] ? '99' :
            gameValue > gamesGrades[3] ? '77' :
              gameValue > gamesGrades[2] ? '55' :
                gameValue > gamesGrades[1] ? '33' : '11';

      /**
       * Combine both colours to make new colour
       */
      return '#0000' + gameColorSuffix;
    }

    
  }, [grades, gamesGrades]);

  /**
   * Sets the style for each GeoJSON feature.
   *
   * @param {Object} feature - GeoJSON feature.
   * @returns {Object} - The style object for the feature.
   */
  const style = (feature) => {
    let countryValue = 0;
    if(currentCountryFilter.includes('%')){
      countryValue = feature.properties[currentCountryFilter.replace('25', '')];
    } else {
      countryValue = feature.properties[currentCountryFilter] || 0;
    }  

    // Only apply string manipulation if `value` is a string
    if (typeof countryValue === 'string') {
      // Remove '%', '$', and commas, then parse as float
      countryValue = parseFloat(countryValue.replace(/[%$,]/g, '')) || 0;
    }
  
    let gameValue = feature.properties.Value || 0;

    if(feature.properties.Unit.includes('million')){
      gameValue = gameValue * 1000000;
    } else if(feature.properties.Unit.includes('thousand')){
      gameValue = gameValue * 1000;
    } else if(feature.properties.Unit.includes('billion')){
      gameValue = gameValue * 1000000000;
    }

    if(isNaN(gameValue)){
      gameValue = 0;
    }

    return {
      fillColor: getColor(countryValue, gameValue),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
    };
  };
  
  
  function createDynamicGrades(values){
    const min = Math.min(...values);
    const max = Math.max(...values);
    const interval = (max - min) / 7;
  
    return Array.from({ length: 7 }, (_, i) => min + i * interval);
  }

  /**
   * Initializes the information control panel for displaying country and game data.
   */
  useEffect(() => {
    const control = L.control({ position: 'topright' });

    control.onAdd = function () {
      this._div = L.DomUtil.create('div', 'info');
      this.update = function (props) {
        let countryFilter = 'N/A';
        let gameFilter = 'N/A';
        if(currentCountryFilter.includes('%')){
          countryFilter = currentCountryFilter.replace('25', '');
        } else {
          countryFilter = currentCountryFilter;
        }
        if(currentGameFilter.includes('%')){
          gameFilter = currentGameFilter.replace('%', '');
        } else if(currentGameFilter === ' for '){
          gameFilter = 'N/A';
        } else {
          gameFilter = currentGameFilter;
        }

        this._div.innerHTML = '<h4>Country & Game Information</h4>' +
          (props ? `<b>${props.Country}</b><br/>
            ${countryFilter}: ${props[countryFilter] || 'N/A'}<br/>
            ${gameFilter}: ${(props['Value'] + ' ' + props['Unit']) || 'N/A'}` 
            : 'Hover over a country');
      };
      this.update();
      return this._div;
    };

    control.addTo(map);
    setInfoControl(control);

    return () => {
      control.remove();
    };
  }, [map, currentCountryFilter, currentGameFilter]);

  /**
   * Initializes the legend control for visualizing data grades.
   */
  useEffect(() => {
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend');
      div.innerHTML = '<h4>Country Data Legend</h4>';
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          `<i style="background:${getColor(grades[i] + 1, grades[0])}"></i> 
          ${grades[i].toFixed(1)}${grades[i + 1] 
  ? `&ndash;${grades[i + 1].toFixed(1)}<br>` : '+'}`;
      }
      div.innerHTML += '<h4>Game Data Legend</h4>';
      for (let i = 0; i < gamesGrades.length; i++) {
        div.innerHTML +=
          `<i style="background:${getColor(gamesGrades[i] + 1
            , gamesGrades[i] + 1, true)}"></i> 
          ${gamesGrades[i].toFixed(1)}${gamesGrades[i + 1] 
  ? `&ndash;${gamesGrades[i + 1].toFixed(1)}<br>` : '+'}`;
      }
      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map, grades, gamesGrades, getColor]);

  function highlightFeature(e) {
    const layer = e.target;
    layer.setStyle({
      weight: 5,
      color: '#353935',
      dashArray: '',
      fillOpacity: 0.7,
    });
    if (infoControl) infoControl.update(layer.feature.properties);
    layer.bringToFront();
  }

  function resetHighlightFeature(e){
    const layer = e.target;
    layer.setStyle({
      weight: 1,
      color: '#FFFFFF',
      dashArray: '5, 5',
      fillOpacity: 0.7,
    });
    if (infoControl) infoControl.update();
  }
  /**
   * Configures events for each feature, including highlight on hover.
   *
   * @param {Object} feature - GeoJSON feature.
   * @param {Object} layer - Layer for the feature.
   */
  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlightFeature,
    });
  }

  return (
    <>
      {Array.isArray(mergedData) && mergedData.length > 0 &&
        <GeoJSON
          key={`${currentCountryFilter}-${currentGameFilter}-${new Date().getTime()}`}
          data={mergedData}
          style={style}
          onEachFeature={onEachFeature}
        />
      }
    </>
  );
}

export default CountryGeoJSON;
