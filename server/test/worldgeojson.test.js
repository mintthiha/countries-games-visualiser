import { db } from '../db/db.mjs';
import app from '../app.mjs';
import sinon from 'sinon';
import request from 'supertest';
import { describe, it, before, after } from 'mocha';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const expect = chai.expect;

// Mock data for stubbing
const mockData = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'id': 'AFG',
      'properties': {
        'name': 'Afghanistan'
      },
      'geometry': {
        'type': 'Polygon',
        'coordinates': [
          [[61.21, 35.65], [62.23, 35.27], [63.19, 35.86], [64.54, 36.31], [61.21, 35.65]]
        ]
      }
    },
    {
      'type': 'Feature',
      'id': 'ALB',
      'properties': {
        'name': 'Albania'
      },
      'geometry': {
        'type': 'Polygon',
        'coordinates': [
          [[20.59, 41.85], [20.46, 41.51], [20.6, 41.08], [20.59, 41.85]]
        ]
      }
    },
    {
      'type': 'Feature',
      'id': 'ARG',
      'properties': {
        'name': 'Argentina'
      },
      'geometry': {
        'type': 'MultiPolygon',
        'coordinates': [
          [[[-65.5, -55.2], [-66.45, -55.25], [-66.95, -54.9], [-65.5, -55.2]]],
          [[[-64.96, -22.07], [-64.37, -22.79], [-63.98, -21.99], [-64.96, -22.07]]]
        ]
      }
    }
  ]
};

/**
 * Test Suite for the GET /api/countries-geojson endpoint.
 *
 * This suite tests the `/api/countries-geojson` endpoint
 * by stubbing the database `connect` and `readAll` methods using Sinon.
 * It verifies that the endpoint responds with the correct JSON data for all countries.
 */
describe('GET /api/countries-geojson', () => {
  let connectStub;
  let readAllStub;

  before(() => {
    connectStub = sinon.stub(db, 'connect').resolves();
    readAllStub = sinon.stub(db, 'readAll').resolves(mockData);
  });

  after(() => {
    connectStub.restore();
    readAllStub.restore();
  });

  it('should respond with JSON data for all countries', async () => {
    const response = await request(app).get('/api/countries-geojson');
    
    // Assert response properties
    expect(response.statusCode).to.equal(200);
    expect(response.body).to.have.property('type', 'FeatureCollection');
    expect(response.body).to.have.property('features').that.is.an('array').with.lengthOf(3);

    // Check individual features
    const [afghanistan, albania, argentina] = response.body.features;
    expect(afghanistan).to.have.property('id', 'AFG');
    expect(afghanistan.properties).to.have.property('name', 'Afghanistan');
    expect(albania).to.have.property('id', 'ALB');
    expect(albania.properties).to.have.property('name', 'Albania');
    expect(argentina).to.have.property('id', 'ARG');
    expect(argentina.properties).to.have.property('name', 'Argentina');
  });
});
