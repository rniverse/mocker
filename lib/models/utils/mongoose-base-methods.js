const mongoose = require('mongoose');

function removeField(doc, key) {
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

module.exports = (opts) => {
  const { MODEL_NAME } = opts;
  return class BaseMethods {
    static getOne(...args) {
      const Model = mongoose.model(MODEL_NAME);
      return Model.findOne(...args);
    }

    static getMany(...args) {
      const Model = mongoose.model(MODEL_NAME);
      return Model.find(...args);
    }

    static getById(...args) {
      const Model = mongoose.model(MODEL_NAME);
      return Model.findById(...args);
    }

    removeSensitive() {
      const Model = mongoose.model(MODEL_NAME);
      Model.schema.eachPath((path, info) => {
        if (info.options.specs && info.options.specs.sensitive) {
          removeField(this, path);
        }
      });
    }
  };
};
