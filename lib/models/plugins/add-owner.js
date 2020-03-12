const mongoose = require('mongoose');
const { Logger } = require('root/utils');

const logger = Logger.child({ service: 'JWT_MW' });
logger.trace('Add owner plugin initialized');

const { SchemaTypes } = mongoose;

function addOwnerHandler(next) {
  if (this.isNew) {
    this.createdBy = this.updatedBy;
  }
  return next();
}
module.exports = function addOwner(schema) {
  schema.add({
    createdBy: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: true
    },
    updatedBy: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: true
    }
  });
  schema.pre('findByIdAndUpdate', addOwnerHandler);
  schema.pre('findOneAndUpdate', addOwnerHandler);
  schema.pre('updateMany', addOwnerHandler);
  schema.pre('updateOne', addOwnerHandler);
  schema.pre('save', addOwnerHandler);
  schema.pre('validate', addOwnerHandler);
};
