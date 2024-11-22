import {db} from '../db/db.mjs';
import app from '../app.mjs';
import sinon from 'sinon';
import request from 'supertest';
import { describe, it, before, after } from 'mocha';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

// Mockdata for stubbing
const mockData = [
  {
    'Algeria': [
      {
        '2017': 192,
        '2018': 225.8,
        '2019': 270.7,
        '2020': 349.9,
        '2021': 417.8,
        '2022': 469.5,
        '2023': 528.7,
        '2024': 583.2,
        '2025': 628.7,
        '2026': 673.7,
        '2027': 718.6,
        'Region': 'Algeria',
        'Market': 'Digital Media',
        'Chart': 'Revenue by Market',
        'Name': 'Total',
        'Unit': 'million USD (US$)'
      },
      {
        '2017': 7.64,
        '2018': 8.99,
        '2019': 10.58,
        '2020': 15.86,
        '2021': 17.93,
        '2022': 20.44,
        '2023': 22.66,
        '2024': 24.81,
        '2025': 26.24,
        '2026': 27.09,
        '2027': 27.72,
        'Region': 'Algeria',
        'Market': 'Digital Media',
        'Chart': 'Revenue by Market',
        'Name': 'Digital Music',
        'Unit': 'million USD (US$)'
      }
    ],
    'Canada': [
      {
        '2017': 192,
        '2018': 225.8,
        '2019': 270.7,
        '2020': 349.9,
        '2021': 417.8,
        '2022': 469.5,
        '2023': 528.7,
        '2024': 583.2,
        '2025': 628.7,
        '2026': 673.7,
        '2027': 718.6,
        'Region': 'Canada',
        'Market': 'Digital Media',
        'Chart': 'Revenue by Market',
        'Name': 'Total',
        'Unit': 'million USD (US$)'
      },
      {
        '2017': 7.64,
        '2018': 8.99,
        '2019': 10.58,
        '2020': 15.86,
        '2021': 17.93,
        '2022': 20.44,
        '2023': 22.66,
        '2024': 24.81,
        '2025': 26.24,
        '2026': 27.09,
        '2027': 27.72,
        'Region': 'Canada',
        'Market': 'Digital Media',
        'Chart': 'Revenue by Market',
        'Name': 'Digital Music',
        'Unit': 'million USD (US$)'
      }
    ]
  }
];


/**
 * Test Suite for the GET /api/countries-games endpoint.
 *
 * This suite tests the `/api/countries-games` endpoint
 * by stubbing the database `connect` and `readAll` methods using Sinon.
 * It verifies that the endpoint responds with the correct JSON data for all countries.
 */
describe('GET /api/countries-games ', () => {
  let readAllStub;
  let connectStub;
  before(function () {
    connectStub = sinon.stub(db, 'connect').resolves();
    readAllStub = sinon.stub(db, 'readAll').resolves(mockData);
  });
  after(function () {
    connectStub.restore();
    readAllStub.restore();
  });


  it('should respond with json appropriate for all countries', async () => {
    const response = await request(app).get('/api/countries');
    expect(response.body[0]['Algeria']).to.deep.equal(mockData[0]['Algeria']);  
    expect(response.body[0]['Canada']).to.deep.equal(mockData[0]['Canada']);   

    expect(response.body[0]).to.have.property('Algeria');  
    expect(response.body[0]).to.have.property('Canada'); 
    expect(response.statusCode).to.equal(200);
  });
});

/**
 * Test Suite for the GET /api/countries-games/detail/Algeria endpoint.
 *
 * This suite tests the `/api/countries-games/detail/Algeria` endpoint
 * by stubbing the database `connect` and `readAll` methods using Sinon.
 * It verifies that the endpoint responds with the correct JSON data for Algeria.
 */
describe('GET /api/countries-games/detail/Algeria', () => {
  let readAllStub;
  let connectStub;
  before(function () {
    connectStub = sinon.stub(db, 'connect').resolves();
    readAllStub = sinon.stub(db, 'readAll').resolves(mockData);
  });
  after(function () {
    connectStub.restore();
    readAllStub.restore();
  });
  it('should respond with json appropriate for Algeria', async () => {
    const response = await request(app).get('/api/countries-games/detail/Algeria');
    expect(response.body['Algeria']).to.deep.equal(mockData[0]['Algeria']);
    expect(response.statusCode).to.equal(200);

  });
});

/**
 * Test Suite for the GET /api/countries-games/detail/Algeriaaa endpoint.
 *
 * This suite tests the `/api/countries-games/detail/Algeriaaa` endpoint
 * by stubbing the database `connect` and `readAll` methods using Sinon.
 * It verifies that the endpoint correctly handles requests for non-existent countries.
 */
describe('GET /api/countries-games/detail/Algeriaaa', () => {
  let readAllStub;
  let connectStub;
  before(function () {
    connectStub = sinon.stub(db, 'connect').resolves();
    readAllStub = sinon.stub(db, 'readAll').resolves(mockData);
  });
  after(function () {
    connectStub.restore();
    readAllStub.restore();
  });

  it('should respond country not found', async () => {
    const response = await request(app).get('/api/countries-games/detail/Algeriaaa');
    expect(response.statusCode).to.equal(404);
    expect(response.body).to.have.property('error');
    expect(response.body.error).to.equal('The country is not found. Try again!');
  });
});

/**
 * Test Suite for the GET /api/countries-games/filter/:chart/:name endpoint.
 *
 * This suite tests the `/api/countries-games/filter/:chart/:name` endpoint
 * by stubbing the database `connect` and `readAll` methods using Sinon.
 * It verifies that the endpoint correctly handles requests for non-existent countries.
 */
describe('GET /api/countries-games/filter/:chart/:name', () => {
  let readAllStub;
  let connectStub;

  before(function () {
    connectStub = sinon.stub(db, 'connect').resolves();
    readAllStub = sinon.stub(db, 'readAll').resolves(mockData);
  });

  after(function () {
    connectStub.restore();
    readAllStub.restore();
  });

  it('should respond with filtered game data for chart and name', async () => {
    const chart = 'Revenue by Market';
    const name = 'Total';

    const expectedFilteredData = [
      {
        Country: 'Algeria',
        Market: 'Digital Media',
        Chart: 'Revenue by Market',
        Name: 'Total',
        Value: 528.7, 
        Unit: 'million USD (US$)',
      },
      {
        Country: 'Canada',
        Market: 'Digital Media',
        Chart: 'Revenue by Market',
        Name: 'Total',
        Value: 528.7, 
        Unit: 'million USD (US$)',
      }
    ];

    // Make the request to the endpoint
    const response = await request(app).get(`/api/countries-games/filter/${chart}/${name}`);

    // Verify the response
    expect(response.statusCode).to.equal(200);
    expect(response.body).to.deep.equal(expectedFilteredData);
  });
});
