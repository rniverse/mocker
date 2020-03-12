const { Logger } = require('root/utils');
const getBaseCtrl = require('./base');

const BaseCtrl = getBaseCtrl({ primaryModel: 'Note' });

const logger = Logger.child({ service: 'NT_CTRLR' });
logger.trace('Note controller initialized');

module.exports = class NoteCtrl extends BaseCtrl {
  static async addNote(req, res) {
    const allowedProperties = ['title', 'info'];
    return super.addEntity(req, res, { allowedProperties });
  }

  static async deleteNote(req, res) {
    return super.deleteEntity(req, res);
  }

  static async updateNote(req, res) {
    const allowedProperties = {
      $set: ['title', 'info']
    };
    return super.updateEntity(req, res, { allowedProperties });
  }

  static async getNotes(req, res) {
    return super.getEntities(req, res);
  }

  static async getNote(req, res) {
    return super.getEntity(req, res);
  }
};
