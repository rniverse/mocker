const CONSTANTS = {
  MODEL: {
    NOTE: 'Note',
    USER: 'User',
    TASK: 'Task',
    COUNTER: 'Counter'
  },
  get COLLECTION() {
    return {
      [this.MODEL.USER]: 'users',
      [this.MODEL.TASK]: 'tasks',
      [this.MODEL.NOTE]: 'notes',
      [this.MODEL.COUNTER]: 'counters'
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
