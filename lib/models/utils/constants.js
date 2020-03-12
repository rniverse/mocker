const CONSTANTS = {
  MODEL: {
    NOTE: 'Note',
    USER: 'User',
    TASK: 'Task'
  },
  get COLLECTION() {
    return {
      [this.MODEL.USER]: 'users',
      [this.MODEL.TASK]: 'tasks',
      [this.MODEL.NOTE]: 'notes'
    };
  },
  get MODELS() {
    return Object.keys(this.COLLECTION);
  },
  get COLLECTIONS() {
    return Object.values(this.COLLECTION);
  },
  get COLLECTION_MODEL() {
    return Object
      .entries(this.COLLECTION)
      .reduce((result, [k, v]) => Object.assign(result, { [v]: k }), {});
  }
};
module.exports = CONSTANTS;
