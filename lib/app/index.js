/* eslint-disable no-unused-vars */
const express = require('express');
const bodyParser = require('body-parser');
const responseTime = require('response-time');
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

const app = express();

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(responseTime(reqPreProcessorMw));

app.use('/api', api);

app.use('**', (_req, res) => SendResponse.notFoundError(res, {
  error: new Error('Path not found')
}));

module.exports = app;
