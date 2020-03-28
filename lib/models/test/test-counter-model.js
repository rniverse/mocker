/* global describe, before, after, it */

const chai = require('chai');
const mongoose = require('mongoose');
const { Logger } = require('root/utils');
const { TestTools } = require('root/tools');
const { constants } = require('../utils');

const logger = Logger.child({ service: 'TST_CNTR_MDL' });

const { MongoDb } = TestTools;
const should = chai.should();

describe('TEST-COUNTER-MODEL', () => {
  before(async () => MongoDb.connect()
    .then(() => MongoDb.clear()));

  describe('get counter value for users', () => {
    it('should create users counter', async () => {
      const Counter = mongoose.model(constants.MODEL.COUNTER);
      return Counter.nextId('users')
        .then((counter) => {
          logger.trace(counter);
          (typeof counter).should.equal('number');
          counter.should.equal(1);
        }).catch((err) => {
          logger.trace(err);
          err.should.not.exist();
        });
    });
    it('should increment users counter', async () => {
      const Counter = mongoose.model(constants.MODEL.COUNTER);
      return Counter.nextId('users')
        .then((counter) => {
          logger.trace(counter);
          (typeof counter).should.equal('number');
          counter.should.equal(2);
        }).catch((err) => {
          logger.trace(err);
          err.should.not.exist();
        });
    });
    it('should throw error on invalid counter name', async () => {
      const Counter = mongoose.model(constants.MODEL.COUNTER);
      return Counter.nextId('Users')
        .catch((err) => {
          logger.error(err);
          should.exist(err);
        }).then((c) => {
          should.not.exist(c);
        });
    });
  });

  after(() => mongoose.connection.close());
});
