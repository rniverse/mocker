/* eslint-disable no-unused-vars */
const restana = require('restana');
const bodyParser = require('body-parser');
const { Logger, SendResponse } = require('root/utils');
const { reqPreProcessorMw } = require('./middlewares');

const __passport = require('./passport');

const logger = Logger.child({ service: 'APP' });

logger.trace('App initialized');

const unknownErrorHandler = (error) => {
  logger.error('Unknown error occured', error);
  process.exit(0);
};

process.on('uncaughtException', unknownErrorHandler);
process.on('unhandledRejection', unknownErrorHandler);

const api = require('./api');

const server = restana();

server.use(bodyParser.json({}));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(reqPreProcessorMw);

server.use('/api', api);

server.use('**', (_req, res) => SendResponse.notFoundError(res, {
  error: new Error('Path not found')
}));

module.exports = server;
