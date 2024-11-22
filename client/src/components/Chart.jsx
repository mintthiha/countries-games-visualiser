import  { useEffect, useRef, useMemo } from 'react';
import './Chart.css';
import Plotly from 'plotly.js-basic-dist-min';

/**
 * Renders a chart component that visualizes the relationship between two datasets
 * (e.g., country-specific data and game-specific data) as a scatter plot.
 *
 * @param {Object} props - The props for the Chart component.
 * @param {Array} props.data - An array of data objects, each representing a
 * country and its corresponding data points.
 * @param {string} props.filterCountryBy - The label for the X-axis, representing
 * the country-specific data filter.
 * @param {string} props.filterGamesBy - The label for the Y-axis, representing
 * the game-specific data filter.
 *
 * @returns {JSX.Element} The rendered Chart component with a scatter plot.
 */
export function Chart({ data, filterCountryBy, filterGamesBy }) {
  const chartRef = useRef(null); 

  const processedData = data.map((country) => ({
    x: [country.data1],
    y: [country.data2],
    mode: 'markers',
    type: 'scatter',
    name: country.Country,
    marker: { size: 12 },
  }));

  const layout = useMemo(() => ({
    title: 'Country Results',
    xaxis: { title: filterCountryBy.replace('25', ''), type: 'log' },  
    yaxis: { title: filterGamesBy, type: 'log' }, 
    autosize: true,
    margin: { t: 40, b: 40, l: 40, r: 40 },
  }), [filterCountryBy, filterGamesBy]);
  

  useEffect(() => {
    if (chartRef.current) {
      Plotly.newPlot(chartRef.current, processedData, layout);
    }
  }, [processedData, layout]); 

  return (
    <div className="chart-container" ref={chartRef} />
  );
}
