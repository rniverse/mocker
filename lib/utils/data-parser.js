const parsers = {
  getInt: (input, onFail = 0) => {
    const n = parseInt(input, 10);
    return !isNaN(n) ? n : onFail;
  }
};

module.exports = parsers;
