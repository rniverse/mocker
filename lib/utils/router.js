module.exports = () => {
  const restana = require('restana');
  const service = restana();
  return service.newRouter();
};
