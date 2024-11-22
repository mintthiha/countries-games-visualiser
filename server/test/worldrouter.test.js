import {db} from '../db/db.mjs';
import app from '../app.mjs';
import sinon from 'sinon';
import request from 'supertest';
import { describe, it, before, after, beforeEach } from 'mocha';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { cache } from '../controllers/readData.mjs';
chai.use(chaiAsPromised);
const expect = chai.expect;

// Mockdata for stubbing
const mockData2 = [
  {
    'Country': 'Afghanistan',
    'Density\n(P/Km2)': 60,
    'Abbreviation': 'AF',
    'Agricultural Land( %)': '58.10%',
    'Land Area(Km2)': '652,230',
    'Armed Forces size': '323,000',
    'Birth Rate': 32.49,
    'Calling Code': 93,
    'Capital/Major City': 'Kabul',
    'Co2-Emissions': '8,672',
    'CPI': 149.9,
    'CPI Change (%)': '2.30%',
    'Currency-Code': 'AFN',
    'Fertility Rate': 4.47,
    'Forested Area (%)': '2.10%',
    'Gasoline Price': '$0.70',
    'GDP': '$19,101,353,833',
    'Gross primary education enrollment (%)': '104.00%',
    'Gross tertiary education enrollment (%)': '9.70%',
    'Infant mortality': 47.9,
    'Largest city': 'Kabul',
    'Life expectancy': 64.5,
    'Maternal mortality ratio': 638,
    'Minimum wage': '$0.43',
    'Official language': 'Pashto',
    'Out of pocket health expenditure': '78.40%',
    'Physicians per thousand': 0.28,
    'Population': '38,041,754',
    'Population: Labor force participation (%)': '48.90%',
    'Tax revenue (%)': '9.30%',
    'Total tax rate': '71.40%',
    'Unemployment rate': '11.12%',
    'Urban_population': '9,797,273',
    'Latitude': 33.93911,
    'Longitude': 67.709953
  },
  {
    'Country': 'Bahrain',
    'Density\n(P/Km2)': '2,239',
    'Abbreviation': 'BH',
    'Agricultural Land( %)': '11.10%',
    'Land Area(Km2)': 765,
    'Armed Forces size': '19,000',
    'Birth Rate': 13.99,
    'Calling Code': 973,
    'Capital/Major City': 'Manama',
    'Co2-Emissions': '31,694',
    'CPI': 117.59,
    'CPI Change (%)': '2.10%',
    'Currency-Code': 'BHD',
    'Fertility Rate': 1.99,
    'Forested Area (%)': '0.80%',
    'Gasoline Price': '$0.43',
    'GDP': '$38,574,069,149',
    'Gross primary education enrollment (%)': '99.40%',
    'Gross tertiary education enrollment (%)': '50.50%',
    'Infant mortality': 6.1,
    'Largest city': 'Riffa',
    'Life expectancy': 77.2,
    'Maternal mortality ratio': 14,
    'Minimum wage': '',
    'Official language': 'Arabic',
    'Out of pocket health expenditure': '25.10%',
    'Physicians per thousand': 0.93,
    'Population': '1,501,635',
    'Population: Labor force participation (%)': '73.40%',
    'Tax revenue (%)': '4.20%',
    'Total tax rate': '13.80%',
    'Unemployment rate': '0.71%',
    'Urban_population': '1,467,109',
    'Latitude': 26.0667,
    'Longitude': 50.5577
  }
];
beforeEach(() => {
  if (cache && typeof cache.clear === 'function') {
    cache.clear(); 
  }
});
/**
 * Test Suite for the GET /api/countries endpoint.
 *
 * This suite tests the `/api/countries` endpoint by stubbing
 * the database `connect` and `readAll` methods using Sinon.
 * It checks whether the response contains JSON data and verifies the status code.
 * 
 */
describe('GET /api/countries ', () => {
  let readAllStub;
  let connectStub;
  before(function () {
    connectStub = sinon.stub(db, 'connect').resolves();
    readAllStub = sinon.stub(db, 'readAll').resolves(mockData2);
  });
  after(function () {
    connectStub.restore();
    readAllStub.restore();
  });
  it('should respond with json appropriate for all countries and algeria', async () => {
    const response = await request(app).get('/api/countries');
    expect(response.body[0]).to.deep.equal(mockData2[0]);
    expect(response.statusCode).to.equal(200);
  });
});


/**
 * Test Suite for the GET /api/countries/detail/Afghanistan endpoint.
 *
 * This suite tests the `/api/countries/detail/Afghanistan` endpoint by
 * stubbing the database `connect` and `readAll` methods using Sinon.
 * It checks whether the response contains the correct JSON
 * data for Afghanistan and verifies the status code.
 */
describe('GET /api/countries/detail/Afghanistan', () => {
  let readAllStub;
  let connectStub;

  before(function () {
    connectStub = sinon.stub(db, 'connect').resolves();
    readAllStub = sinon.stub(db, 'readAll').resolves(mockData2); 
  });

  after(function () {
    connectStub.restore();
    readAllStub.restore();
  });

  it('should respond with JSON appropriate for Afghanistan', async () => {
    const response = await request(app).get('/api/countries/detail/Afghanistan');
    const expectedCountryData = mockData2.find(country => country.Country === 'Afghanistan');
    expect(response.body).to.deep.equal(expectedCountryData);
    expect(response.statusCode).to.equal(200);
  });
});

/**
 * Test Suite for the GET /api/countries/Algeriaaa endpoint.
 *
 * This suite tests the `/api/countries/detail/Algeriaaa` endpoint by
 * stubbing the database `connect` and `readAll` methods using Sinon.
 * It verifies that the endpoint responds appropriately when a non-existent country is requested.
 */
describe('GET /api/countries/Algeriaaa ', () => {
  let readAllStub;
  let connectStub;
  before(function () {
    connectStub = sinon.stub(db, 'connect').resolves();
    readAllStub = sinon.stub(db, 'readAll').resolves(mockData2);
  });
  after(function () {
    connectStub.restore();
    readAllStub.restore();
  });
  it('should respond country not found', async () => {
    const response = await request(app).get('/api/countries/detail/Algeriaaa');
    expect(response.statusCode).to.equal(404);
    expect(response.body).to.have.property('error');
    expect(response.body.error).to.equal('The country is not found. Try again!');
  });
});



/**
 * Test Suite for the GET /api/countries/filter?filter=   endpoint.
 *
 * This suite tests the `/api/countries/filter?filter=GDP` endpoint by
 * stubbing the database `connect` and `readAll` methods using Sinon.
 * It verifies that the endpoint responds appropriately when a non-existent country is requested.
 */
describe('GET /api/countries/filter?filter=GDP', () => {
  let readAllStub;
  let connectStub;

  before(function () {
    connectStub = sinon.stub(db, 'connect').resolves();
    readAllStub = sinon.stub(db, 'readAll').resolves(mockData2); 
  });

  after(function () {
    connectStub.restore();
    readAllStub.restore();
  });

  it('should respond with JSON appropriate for GDP', async () => {
    const response = await request(app).get('/api/countries/filter?filter=GDP');
    
    const expectedCountryData = mockData2.map(country => ({
      Country: country.Country,
      GDP: country.GDP
    }));

    expect(response.body).to.deep.equal(expectedCountryData);
    expect(response.statusCode).to.equal(200);
  });
});

/**
 * Test Suite for the GET /api/countries/filter?filter=    endpoint.
 *
 * This suite tests the `/api/countries/filter?filter= ` endpoint by
 * stubbing the database `connect` and `readAll` methods using Sinon.
 * It verifies that the endpoint responds appropriately when a non-existent country is requested.
 */
describe('GET /api/countries/filter?filter= ', () => {
  let readAllStub;
  let connectStub;

  before(function () {
    connectStub = sinon.stub(db, 'connect').resolves();
    readAllStub = sinon.stub(db, 'readAll').resolves(mockData2); 
  });

  after(function () {
    connectStub.restore();
    readAllStub.restore();
  });

  it('should respond with 404', async () => {
    const response = await request(app).get('/api/countries/filter?filter= ');
    
    expect(response.statusCode).to.equal(404);
    expect(response.body).to.have.property('error');
    expect(response.body.error).to.equal('The filter is not found. Try again!');
  });
});


