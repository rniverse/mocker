const mongoose = require('mongoose');
const { Logger, handlePromise, SendResponse } = require('root/utils');

const logger = Logger.child({ service: 'BS_CTRL' });
logger.trace('Base controller initialized');

module.exports = (options) => {
  const { primaryModel } = options;
  const Model = mongoose.model(primaryModel);
  return class BaseCtrl {
    static async getEntity(req, res) {
      const { id } = req.params;
      const { user: createdBy } = req.query;
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
      const { user: updatedBy } = req.query;
      const response = await handlePromise(Model
        .find({ updatedBy })
        .sort({ updatedAt: -1 })
        .removeSensitive()
        .lean());
      const { ok } = response;
      if (!ok) return SendResponse.badRequestError(res, response);
      return SendResponse.success(res, response);
    }

    static async updateEntity(req, res, opts) {
      const { user: updatedBy } = req.body || {};
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
      const { user: createdBy } = req.query || {};
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
      const { user: updatedBy } = req.body || {};
      const { allowedProperties } = opts;
      const doc = {};
      if (updatedBy) {
        Object.assign(doc, { updatedBy });
      }
      for (const property of allowedProperties) {
        if (req.body && req.body[property]) {
          doc[property] = req.body[property];
        }
      }
      const entity = new Model(doc);
      const validateResponse = await handlePromise(entity.validate());
      logger.debug(`${primaryModel} validation response`, validateResponse);
      let { ok } = validateResponse;
      if (!ok) return SendResponse.badRequestError(res, validateResponse);
      const saveResponse = await handlePromise(entity.save());
      logger.debug(`${primaryModel} save response`, saveResponse);
      ({ ok } = saveResponse);
      if (!ok) return SendResponse.badRequestError(res, saveResponse);
      return SendResponse.success(res, saveResponse);
    }
  };
};
