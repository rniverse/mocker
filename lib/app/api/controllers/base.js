const mongoose = require('mongoose');
const config = require('config');
const {
  Logger, handlePromise, SendResponse, DataParser
} = require('root/utils');

const logger = Logger.child({ service: 'BS_CTRL' });
logger.trace('Base controller initialized');

module.exports = (options) => {
  const { primaryModel } = options;
  const Model = mongoose.model(primaryModel);
  return class BaseCtrl {
    static async getEntity(req, res) {
      const { id } = req.params;
      const { reqBy: createdBy } = req;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return SendResponse.badRequestError(res, { error: new Error('Invalid id') });
      }
      const response = await handlePromise(Model
        .findOne({ _id: id, createdBy })
        .removeSensitive()
        .lean());
      const { ok } = response;
      if (!ok) return SendResponse.badRequestError(res, response);
      return SendResponse.success(res, response);
    }

    static async getEntities(req, res) {
      const { reqBy: createdBy } = req;
      let { limit } = req.query;
      limit = DataParser.getInt(limit, config.get('MAX_FETCH_LIMIT'));
      const response = await handlePromise(Model
        .find({ createdBy })
        .sort({ updatedAt: -1 })
        .limit(Math.abs(limit))
        .removeSensitive()
        .lean());
      const { ok } = response;
      if (!ok) return SendResponse.badRequestError(res, response);
      return SendResponse.success(res, response);
    }

    static async updateEntity(req, res, opts) {
      const { reqBy: updatedBy } = req;
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return SendResponse.badRequestError(res, { error: new Error('Invalid id') });
      }
      const { allowedProperties } = opts || {};
      const updateOptions = { new: true };
      const allowedUpdateOps = ['$set', '$unset', '$inc'];
      const setObject = {};
      const query = { _id: id };
      if (!['User'].includes(primaryModel)) {
        setObject.updatedBy = updatedBy;
        query.createdBy = updatedBy;
      }
      const updateObject = {
        $set: setObject,
        $unset: {},
        $inc: {}
      };
      for (const op of allowedUpdateOps) {
        if (req.body[op]) {
          for (const property of allowedProperties[op]) {
            if (req.body[op][property]) {
              updateObject[op][property] = req.body[op][property];
            }
          }
        }
      }
      const response = await handlePromise(Model
        .findOneAndUpdate(query, updateObject, updateOptions)
        .removeSensitive());
      logger.debug(`${primaryModel} update ${id} response`, response);
      const { ok, result } = response;
      if (!ok) return SendResponse.badRequestError(res, response);
      if (!result) {
        return SendResponse.badRequestError(res, {
          error: new Error(`${primaryModel} record not found`)
        });
      }
      return SendResponse.success(res, response);
    }

    static async deleteEntity(req, res) {
      const { reqBy: createdBy } = req;
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return SendResponse.badRequestError(res, { error: new Error('Invalid id') });
      }
      const response = await handlePromise(Model.deleteOne({ _id: id, createdBy }));
      logger.debug(`${primaryModel} delete ${id} response`, response);
      if (!response.ok) {
        return SendResponse.badRequestError(res, response);
      }
      return SendResponse.success(res, response);
    }

    static async addEntity(req, res, opts) {
      const { reqBy: updatedBy } = req;
      const { allowedProperties, customMethod } = opts;
      const doc = {};
      if (updatedBy) {
        Object.assign(doc, { updatedBy });
      }
      for (const property of allowedProperties) {
        if (req.body && req.body[property]) {
          doc[property] = req.body[property];
        }
      }
      let response = null;
      if (customMethod) {
        response = await handlePromise(Model[customMethod](doc));
      } else {
        const entity = new Model(doc);
        response = await handlePromise(entity.save());
      }
      logger.debug(`${primaryModel} save response`, response);
      const { ok } = response;
      if (!ok) return SendResponse.badRequestError(res, response);
      return SendResponse.created(res, response);
    }

    static async getPublicEntity(req, res) {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return SendResponse.badRequestError(res, { error: new Error('Invalid id') });
      }
      const response = await handlePromise(Model
        .findOne({ _id: id })
        .removeSensitive()
        .lean());
      const { ok } = response;
      if (!ok) return SendResponse.badRequestError(res, response);
      return SendResponse.success(res, response);
    }

    static async getPublicEntities(req, res) {
      let { limit } = req.query;
      limit = DataParser.getInt(limit, config.get('MAX_FETCH_LIMIT'));
      const response = await handlePromise(Model
        .find({})
        .sort({ updatedAt: -1 })
        .limit(Math.abs(limit))
        .removeSensitive()
        .lean());
      const { ok } = response;
      if (!ok) return SendResponse.badRequestError(res, response);
      return SendResponse.success(res, response);
    }
  };
};
