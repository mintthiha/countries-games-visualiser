import {db} from '../db/db.mjs';
import sinon from 'sinon';
import { describe, it, before, after } from 'mocha';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { readFileFromPath } from '../utils/util.mjs';

chai.use(chaiAsPromised);
const expect = chai.expect;

/**
 * Test Suite for data loading functionality.
 *
 * This suite tests the data loading from JSON files using the `readFileFromPath` function.
 * It verifies that the loaded data matches the expected structure and content.
 */
describe('test data loading', () => {
  let connectStub;
  before(function () {
    connectStub = sinon.stub(db, 'connect').resolves();
  });
  after(function () {
    connectStub.restore();
  });
  it('should give valid data', async () => {
    const data = await readFileFromPath('./test/fakeCountryData.json');
    expect(data).to.deep.equal({ test: 'peanut butter' });
  });
  
  // This test passes, but should fail. Eventually is from the chaiAsPromised library.
  
  it('should give valid data', async () => {
    const data = await readFileFromPath('./test/fakeGameData.json');
    expect(data).to.deep.equal({ test: 'peanut butter' });
  });
});
  