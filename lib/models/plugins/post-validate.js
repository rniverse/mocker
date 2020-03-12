const mongoose = require('mongoose');
const { handlePromise, Logger } = require('root/utils');
const { constants } = require('../utils');

const logger = Logger.child({ service: 'JWT_MW' });
logger.trace('Post validate plugin initialized');

module.exports = function postValidator(schema) {
  const { collection } = schema.options;
  async function postValidate(data) {
    const Model = mongoose.model(constants.COLLECTION_MODEL[collection]);
    const indexes = schema.indexes();
    for (const record of indexes) {
      const [keys, options] = record;
      if (options.unique) {
        const fields = Object.keys(keys);
        let isNull = false;
        const query = fields
          .reduce((result, k) => {
            if (!data[k] && !options.sparse) isNull = true;
            return Object.assign(result, { [k]: data[k] });
          }, {});
        if (isNull) {
          throw new Error('Required fields are missing');
        }
        // eslint-disable-next-line no-await-in-loop
        const { ok, error, result: doc } = await handlePromise(
          Model
            .findOne(query)
            .select('_id')
            .lean()
        );
        if (!ok) throw error;
        if (doc) {
          const msgPart = fields.join(', ');
          throw new Error(`Record already exists with ${msgPart}`);
        }
      }
    }
  }
  schema.post('validate', postValidate);
  schema.post('validateSync', postValidate);
};
