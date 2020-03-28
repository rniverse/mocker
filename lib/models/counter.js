const mongoose = require('mongoose');
const { Logger, regex, handlePromise } = require('root/utils');
const { MongooseBaseMethods, constants } = require('./utils');

const { COUNTER: MODEL_NAME } = constants.MODEL;

const BaseMethods = MongooseBaseMethods({ MODEL_NAME });

const logger = Logger.child({ service: 'NT_MDL' });
logger.trace('Counter model initialized');

const { Schema } = mongoose;

const CounterSchema = new Schema({
  _id: {
    type: Schema.Types.String,
    trim: true,
    required: true,
    validate: {
      validator: regex.seq_id,
      message: 'invalid counter name'
    }
  },
  seq: { type: Schema.Types.Number }
}, {
  versionKey: false,
  collection: constants.COLLECTION[MODEL_NAME]
});

class CounterMethods extends BaseMethods {
  static async nextId(name) {
    const Counter = mongoose.model(MODEL_NAME);
    const c = new Counter({ _id: name });
    const validationError = c.validateSync();
    if (validationError) throw validationError;
    const { ok, error, result } = await handlePromise(Counter
      .findOneAndUpdate(
        { _id: name },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      ).lean());
    if (!ok) throw error;
    return result.seq;
  }
}

CounterSchema.loadClass(CounterMethods);

const CounterModel = mongoose.model(MODEL_NAME, CounterSchema);

module.exports = CounterModel;
