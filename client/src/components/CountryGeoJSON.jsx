import { useEffect, useState, useCallback } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import './CountryGeoJSON.css';

/**
 * CountryGeoJSON component that displays GeoJSON data for countries on a Leaflet map.
 *
 * @param {Object} mergedData - The merged data of the countries data, game data & countries geoJSON
 * @param {string} currentCountryFilter - Filter for displaying specific country data.
 * @param {string} currentGameFilter - Filter for displaying specific game data.
 *
 * @returns {JSX.Element} - The rendered CountryGeoJSON component with interactive features.
 */
function CountryGeoJSON({ mergedData, currentCountryFilter, currentGameFilter }) {
  const map = useMap();
  const [infoControl, setInfoControl] = useState(null);

  /**
   * Helper method to fix the country filter, since it has a redundant '25'.
   * @param {*} countryFilter 
   * @returns 
   */
  const fixCountryFilter = (countryFilter) => {
    if(countryFilter.includes('%')){
      return countryFilter.replace('25', '');
    } else {
      return countryFilter || 0;
    }  
  };

  /**
   * Generates dynamic grades for both country and game data.
   */
  const createDynamicGrades = (values) => {
    const sortedValues = values.sort((a, b) => a - b);
    const trimmedValues = sortedValues.slice(5, -5);
    const min = Math.min(...trimmedValues);
    const max = Math.max(...trimmedValues);
    const interval = (max - min) / 7;

    return Array.from({ length: 7 }, (_, i) => min + i * interval);
  };

  /**
   * Grades for the countries values
   */
  const grades = createDynamicGrades(
    mergedData.map((feature) => {
      const value = feature.properties[fixCountryFilter(currentCountryFilter)];
      
      return typeof value === 'string'
        ? parseFloat(value.replace(/[%$,]/g, '')) || 0
        : value || 0;
    })
  );

  /**
   * Grades for the games values
   */
  const gamesGrades = createDynamicGrades(
    mergedData.map((feature) => {
      let value = feature.properties.Value || 0;
      const unit = feature.properties.Unit || '';
      if (unit.includes('million')) value *= 1_000_000;
      if (unit.includes('thousand')) value *= 1_000;
      if (unit.includes('billion')) value *= 1_000_000_000;
      return value || 0;
    })
  );

  /**
   * Returns a color based on country and game values.
   * 
   * @param {number} countryValue - The country's current filter value.
   * @param {number} gameValue - The game's current filter value.
   * @param {boolean} [legendMode=false] - If true, applies legend styling.
   * @returns {string} - The hex color for the feature.
   */
  const getColor = useCallback((countryValue, gameValue, legendMode = 'country') => {
    if(legendMode === 'country'){
      /**
      * Modify only the first 2 values of the colour code (red)
      */
      const countryColor = getCountryColor(countryValue, grades);

      if(gameValue === 0){
        return countryColor + '00';
      }

      /**
       * Modify only the last 2 values of the colour code (blue)
       */
      const gameColorSuffix = getGameColor(gameValue, gamesGrades);

      if(countryValue === 0){
        return '#0000' + gameColorSuffix;
      }

      /**
       * Combine both colours to make new colour
       */
      return countryColor + gameColorSuffix;
    } else if(legendMode === 'game') {
      const gameColorSuffix = getGameColor(gameValue, gamesGrades);

      /**
       * Combine both colours to make new colour
       */
      return '#0000' + gameColorSuffix;
    } else {
      const gameColorSuffix = getGameColor(gameValue, gamesGrades);
      const countryColor = getCountryColor(countryValue, grades);

      return countryColor + gameColorSuffix;
    }
    
  }, [grades, gamesGrades]);

  /**
   * Helper method to that uses Country Value, return appropriate colour
   * @param {String} value 
   * @param {Array} grades 
   * @returns 
   */
  const getCountryColor = (value, grades) => {
    return value > grades[6] ? '#FF00' :
      value > grades[5] ? '#CC00' :
        value > grades[4] ? '#9900' :
          value > grades[3] ? '#7700' :
            value > grades[2] ? '#5500' :
              value > grades[1] ? '#3300' : '#1100';
  };

  /**
   * Helper method to that uses Game Value, return appropriate colour
   * @param {String} gameValue 
   * @param {Array} gamesGrades 
   * @returns 
   */
  const getGameColor = (gameValue, gamesGrades) => {
    return gameValue > gamesGrades[6] ? 'FF' :
      gameValue > gamesGrades[5] ? 'CC' :
        gameValue > gamesGrades[4] ? '99' :
          gameValue > gamesGrades[3] ? '77' : 
            gameValue > gamesGrades[2] ? '55' :
              gameValue > gamesGrades[1] ? '33' : '11';
  };

  /**
   * Sets the style for each GeoJSON feature.
   *
   * @param {Object} feature - GeoJSON feature.
   * @returns {Object} - The style object for the feature.
   */
  const style = (feature) => {
    let countryValue = feature.properties[fixCountryFilter(currentCountryFilter)];

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

  /**
   * Initializes the information control panel for displaying country and game data.
   */
  useEffect(() => {
    const control = L.control({ position: 'topright' });

    control.onAdd = function () {
      this._div = L.DomUtil.create('div', 'info');
      this.update = function (props) {
        const countryFilter = fixCountryFilter(currentCountryFilter);
        let gameFilter = 'N/A';
        if(currentGameFilter.includes('%')){
          gameFilter = currentGameFilter.replace('%', '');
        /* for is because of line 143 in App.jsx which combines
         both filters thus making empty checks kinda complicated*/
        } else if(currentGameFilter === ' for '){
          gameFilter = 'N/A';
        } else {
          gameFilter = currentGameFilter;
        }

        this._div.innerHTML = '<h4>Country & Game Information</h4>' +
          (props ? `<b>${props.Country}</b><br/>
            ${countryFilter}: ${props[countryFilter] || 'N/A'}<br/>
            ${gameFilter}: ${props['Value'] + ' ' + props['Unit'] || 'N/A'}` 
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

      /**
       * Function to Format Numbers in the Legend
       */
      function formatNumber(num) {
        if (!num) return '';
        if (num >= 1000000000){
          return `${(num / 10000000).toFixed(1)} billion(s)`;
        } else if (num >= 100000) {
          return `${(num / 1000000).toFixed(1)} million(s)`;
        } else if (num >= 1000) {
          return `${(num / 1000).toFixed(1)} thousand(s)`;
        }
        return num.toFixed(1);
      }

      const displayColorBoxes = (index, colorBox, nextValue, grades) => {
        if (index === 0) {
          return `${colorBox} ${grades[index]} 
          - ${formatNumber(nextValue)} <br>`;
        } else if (index === grades.length - 1) {
          return `${colorBox} ${formatNumber(grades[index])} + </span><br>`;
        } else {
          return `${colorBox} ${formatNumber(grades[index])}
          - ${formatNumber(nextValue)} <br>`;
        }
      };

      /**
       * Country Data Legend
       */
      div.innerHTML = '<h4>Country Data Legend</h4>';
      if(currentCountryFilter === ''){
        div.innerHTML += '<h5> Select a Filter! <h5>';
      } else {
        for (let i = 0; i < grades.length; i++) {
          const colorBox = `<i style="background:${getColor(
            grades[i] + 1,
            0,
            'country')}"></i>`;
          
          const nextValue = grades[i + 1];
          div.innerHTML += displayColorBoxes(i, colorBox, nextValue, grades);
        }
      }

      /**
       * Game Data Legend
       */
      div.innerHTML += '<h4>Game Data Legend</h4>';
      if (
        /* for is because of line 143 in App.jsx which combines
         both filters thus making empty checks kinda complicated*/
        currentGameFilter === ' for ' 
        || currentGameFilter.endsWith('for ') 
        || currentGameFilter.startsWith(' for')) {
        div.innerHTML += '<h5> Select a Filter! </h5>';
      } else if(currentGameFilter === 'Users by Market for In-game Advertising'){
        div.innerHTML += '<h5> There is no data for this game filter! </h5>';
      }else {
        for (let i = 0; i < gamesGrades.length; i++) {
          const colorBox = `<i style="background:${getColor(
            grades[i] + 1,
            gamesGrades[i] + 1,
            'game')}"></i>`;
          
          const nextValue = gamesGrades[i + 1];
          div.innerHTML += displayColorBoxes(i, colorBox, nextValue, gamesGrades);
        }
      }

      /**
       * Combined Data Legend
       */
      div.innerHTML += '<h4>Combined Data Legend</h4>';
      /* for is because of line 143 in App.jsx which combines
         both filters thus making empty checks kinda complicated*/
      if (
        currentGameFilter === ' for ' 
        || currentCountryFilter === '' 
        || currentGameFilter.endsWith('for ')
        || currentGameFilter.startsWith(' for')
      ) {
        div.innerHTML += '<h5>Select a Filter!<h5>';
      } else if(currentGameFilter === 'Users by Market for In-game Advertising'){
        div.innerHTML += '<h5> There is no data for this game filter! </h5>';
      } else {
        for (let i = 0; i < gamesGrades.length; i++) {
          const colorBox = `<i style="background:${getColor(
            grades[i] + 1,
            gamesGrades[i] + 1,
            'combined')}"></i>`;
          
          div.innerHTML += `${colorBox} <br>`;
        }
        div.innerHTML += `<h5>Note: If colour is not in Combined Data Legend, <br>
        little to no correlation between the 2 data!</h5>`;
      }

      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map, grades, gamesGrades, mergedData, getColor, currentCountryFilter, currentGameFilter]);

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