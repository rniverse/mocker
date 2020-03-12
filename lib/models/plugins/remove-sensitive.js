/* eslint-disable no-param-reassign */
const { Logger } = require('root/utils');

const logger = Logger.child({ service: 'JWT_MW' });
logger.trace('Remove Sensitive plugin initialized');

module.exports = function removeSensitive(schema) {
  schema.query.removeSensitive = function removeSensitiveQuery() {
    const projection = {};
    schema.eachPath((path, info) => {
      if (info.options.specs && info.options.specs.sensitive) {
        projection[path] = 0;
      }
    });
    if (!this.selectedInclusively()) {
      this.select(projection);
    }
    return this;
  };

  function removeField(doc, key) {
    if (!doc) return;
    const docType = typeof doc;
    if (Array.isArray(doc)) {
      for (const record of doc) {
        record[key] = undefined;
        delete record[key];
      }
    } else if (docType === 'object') {
      doc[key] = undefined;
      delete doc[key];
    }
  }
  function handler(doc, next) {
    schema.eachPath((path, info) => {
      if (info.options.specs && info.options.specs.sensitive) {
        removeField(doc, path);
      }
    });
    next();
  }

  schema.post('create', handler);
  schema.post('save', handler);
  schema.post('signin', handler);
  schema.post('signup', handler);
  schema.post('resetPassword', handler);
  schema.post('forgotPassword', handler);
  schema.post('changePassword', handler);
  schema.post('getOne', handler);
  schema.post('getMany', handler);
  schema.post('getById', handler);
  schema.post('updateSensitive', handler);
};
