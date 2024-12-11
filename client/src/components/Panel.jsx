import { useState } from 'react';
import './Map.css';
import './Panel.css';
/**
 * Panel component for controlling views, sorting, and filtering data.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.setView - Function to set the current view (e.g., 'world' or 'chart').
 * @param {Function} props.countryFilterButtonHandler -Handler for changing the country  filter.
 * @param {Function} props.gameFilterChartButtonHandler -Handler for changing the game type filter.
 * @param {Function} props.gameFilterTypeButtonHandler -Handler for changing the game content filter
 *
 * @returns {JSX.Element} The rendered Panel component.
 */

export default function Panel(
  {countryFilter, gameFilter, setView, countryFilterButtonHandler,
    gameFilterChartButtonHandler, gameFilterTypeButtonHandler}){
  const [isVisible, setIsVisible] = useState(true);

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  const countryOptions = [
    {value:'Agricultural Land( %25)', text:'Agricultural Land (%)'},
    {value:'Land Area(Km2)', text:'Land Area (Km2)'},
    {value:'Armed Forces size', text:'Armed Forces size'},
    {value:'Birth Rate', text:'Birth Rate'},
    {value:'Co2-Emissions', text:'Co2 Emissions'},
    {value:'CPI', text:'CPI'},
    {value:'CPI Change (%25)', text:'CPI Change (%)'},
    {value:'Fertility Rate', text:'Fertility Rate'},
    {value:'Forested Area (%25)', text:'Forested Area (%)'},
    {value:'Gasoline Price', text:'Gasoline Price'},
    {value:'GDP', text:'GDP'},
    {value:'Gross primary education enrollment (%25)', 
      text:'Gross primary education enrollment (%)'},
    {value:'Gross tertiary education enrollment (%25)',
      text:'Gross tertiary education enrollment (%)'},
    {value:'Infant mortality', text:'Infant Mortality'},
    {value:'Life expectancy', text:'Life Expectancy'},
    {value:'Maternal mortality ratio', text:'Maternal Mortality Ratio'},
    {value:'Minimum wage', text:'Minimum Wage'},
    {value:'Out of pocket health expenditure', text:'Out of Pocket Health Expenditure'},
    {value:'Physicians per thousand', text:'Physicians per Thousand'},
    {value:'Population', text:'Population'},
    {value:'Population: Labor force participation (%25)', text:'Labor Force Participation (%)'},
    {value:'Tax revenue (%25)', text:'Tax Revenue (%)'},
    {value:'Total tax rate', text:'Total Tax Rate'},
    {value:'Unemployment rate', text:'Unemployment Rate'},
    {value:'Urban_population', text:'Urban Population'},

  ];

  const gameDataOptions = [
    { value: 'Revenue by Market', text: 'Revenue by Market' },
    { value: 'Average Revenue per User by Market', text: 'Average Revenue per User by Market' },
    { value: 'Users by Market', text: 'Users by Market' },
    { value: 'Revenue Growth by Market', text: 'Revenue Growth by Market' },
  ];

  const gameContentOptions = [
    { value: 'Total', text: 'Total' },
    { value: 'Online Games', text: 'Online Games' },
    { value: 'Mobile Games', text: 'Mobile Games' },
    { value: 'In-game Advertising', text: 'In-game Advertising' },
    { value: 'Games Live Streaming', text: 'Games Live Streaming' },
    { value: 'Download Games', text: 'Download Games' },
  ];

  return (
    <>
      {/* Show Sidebar button */}
      {!isVisible && 
        <button
          className="show-sidebar-button"
          onClick={() => setIsVisible(true)}
        >
          Show Sidebar
        </button>
      }

      {isVisible && 
        <div className="ui-controls">
      
          <section id="top-section">
            <h1> World Wide Games </h1>
            <img src="/world.webp"></img>
          </section>
    
          <table>
            <tbody>
              <tr>
                <td>
                  <h3>Views</h3>
                </td>
              </tr>
              <tr>
                <td>
                  <button onClick={() => setView('world')}> Map </button>
                </td>
              </tr>
              <tr>
                <td>
                  <button onClick={() => setView('chart')}> Graph </button>
                </td>
              </tr>
            </tbody>
          </table>
    
          <table>
            <tbody>
              <tr>
                <td>
                  <h3>Sort by Country Data</h3>
                </td>
              </tr>
              <tr>
                <td>
                  <select
                    id="countrySelect"
                    value={countryFilter}
                    onChange={(e) => countryFilterButtonHandler(e.target.value)}
                  >
                    <option value=""
                      aria-label={`Option for no filter`}>No Country Filter</option>
                    {countryOptions.map((element) => 
                      <option key={element.value} value={element.value}
                        aria-label={`Option for ${element.text}`}>
                        {element.text}
                      </option>
                    )}
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
    
    
          <table>
            <tbody>
              <tr>
                <td>
                  <h3>Sort by Game Data Type</h3>
                </td>
              </tr>
              <tr>
                <td>
                  <select
                    id="filterChartSelect"
                    value={gameFilter.split(' for ')[0]}
                    onChange={(e) => gameFilterChartButtonHandler(e.target.value)}
                  >
                    <option value=""
                      aria-label={`Option for no filter`}>No Game Data Type Filter</option>
                    {gameDataOptions.map((element) => 
                      <option key={element.value} value={element.value}
                        aria-label={`Option for ${element.text}`}>
                        {element.text}
                      </option>
                    )}
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
    
          <table>
            <tbody>
              <tr>
                <td>
                  <h3>Sort by Game Data Content</h3>
                </td>
              </tr>
              <tr>
                <td>
                  <select
                    id="filterTypeSelect"
                    value={gameFilter.split(' for ')[1]}
                    onChange={(e) => gameFilterTypeButtonHandler(e.target.value)}
                  >
                    <option value=""
                      aria-label={`Option for no filter`}>No Game Type Filter</option>
                    {gameContentOptions.map((element) => 
                      <option key={element.value} value={element.value}
                        aria-label={`Option for ${element.text}`}>
                        {element.text}
                      </option>
                    )}
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
  
          <label>
            Hide Sidebar
            <input type="checkbox" onChange={toggleSidebar} />
          </label>
        </div>
      }
    </>
  );
}
