const mongoose = require('mongoose');
const { Logger, regex } = require('root/utils');
const { MongooseBaseMethods, constants } = require('./utils');
const { addOwner } = require('./plugins');

const { NOTE: MODEL_NAME } = constants.MODEL;

const BaseMethods = MongooseBaseMethods({ MODEL_NAME });

const logger = Logger.child({ service: 'NT_MDL' });
logger.trace('Note model initialized');

const { Schema } = mongoose;

const NoteSchema = new Schema({
  title: {
    type: Schema.Types.String,
    trim: true,
    required: true,
    validate: {
      validator: regex.title,
      message: 'invalid note title'
    }
  },
  info: { type: Schema.Types.String, trim: true }
}, {
  timestamps: true,
  versionKey: false,
  collection: constants.COLLECTION[MODEL_NAME]
});

NoteSchema.plugin(addOwner);

NoteSchema.index({ updatedAt: 1 }, { background: true });

class NoteMethods extends BaseMethods {
}

NoteSchema.loadClass(NoteMethods);

const NoteModel = mongoose.model(MODEL_NAME, NoteSchema);

module.exports = NoteModel;
