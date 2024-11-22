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
  {setView, countryFilterButtonHandler, gameFilterChartButtonHandler, gameFilterTypeButtonHandler}){
  const [isVisible, setIsVisible] = useState(true);

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      {/* Show Sidebar button */}
      {!isVisible && (
        <button
          className="show-sidebar-button"
          onClick={() => setIsVisible(true)}
        >
          Show Sidebar
        </button>
      )}

      {isVisible && (
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
                  <select onChange={(e) => countryFilterButtonHandler(e.target.value)}>
                    <option value="">
                      Select Country Data
                    </option>
                    <option value="Agricultural Land( %25)">Agricultural Land (%)</option>
                    <option value="Land Area(Km2)">Land Area (Km2)</option>
                    <option value="Armed Forces size">Armed Forces size</option>
                    <option value="Birth Rate">Birth Rate</option>
                    <option value="Co2-Emissions">Co2 Emissions</option>
                    <option value="CPI">CPI</option>
                    <option value="CPI Change (%25)">CPI Change (%)</option>
                    <option value="Fertility Rate">Fertility Rate</option>
                    <option value="Forested Area (%25)">Forested Area (%)</option>
                    <option value="Gasoline Price">Gasoline Price</option>
                    <option value="GDP">GDP</option>
                    <option value="Gross primary education enrollment (%25)">
                      Gross primary education enrollment (%)
                    </option>
                    <option value="Gross tertiary education enrollment (%25)">
                      Gross tertiary education enrollment (%)
                    </option>
                    <option value="Infant mortality">Infant Mortality</option>
                    <option value="Life expectancy">Life Expectancy</option>
                    <option value="Maternal mortality ratio">Maternal Mortality Ratio</option>
                    <option value="Minimum wage">Minimum Wage</option>
                    <option value="Out of pocket health expenditure">
                      Out of Pocket Health Expenditure
                    </option>
                    <option value="Physicians per thousand">Physicians per Thousand</option>
                    <option value="Population">Population</option>
                    <option value="Population: Labor force participation (%25)">
                      Labor Force Participation (%)
                    </option>
                    <option value="Tax revenue (%25)">Tax Revenue (%)</option>
                    <option value="Total tax rate">Total Tax Rate</option>
                    <option value="Unemployment rate">Unemployment Rate</option>
                    <option value="Urban_population">Urban Population</option>
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
                  <select onChange={(e) => gameFilterChartButtonHandler(e.target.value)}>
                    <option value="">
                      Select Game Data Type
                    </option>
                    <option value="Revenue by Market">Revenue by Market</option>
                    <option value="Average Revenue per User by Market">
                      Average Revenue per User by Market
                    </option>
                    <option value="Users by Market">Users by Market</option>
                    <option value="Revenue Growth by Market">Revenue Growth by Market</option>
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
                  <select onChange={(e) => gameFilterTypeButtonHandler(e.target.value)}>
                    <option value="">
                        Select Game Data Content
                    </option>
                    <option value="Total">Total</option>
                    <option value="Online Games">Online Games</option>
                    <option value="Mobile Games">Mobile Games</option>
                    <option value="In-game Advertising">In-game Advertising</option>
                    <option value="Games Live Streaming">Games Live Streaming</option>
                    <option value="Download Games">Download Games</option>
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
      )}
    </>
  );
}
