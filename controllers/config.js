'use strict';

const logger = require('../util/logger');
const config = require('../util/config').getConfig();

/**
 * overwrite default log level, because we can't initialize it in util/logger.js
 * it will cause infinite reference loop between util/logger.js and util/config.js
 */

if (config.DEBUG) {
  for (const transport of logger.transports) {
    transport.level = 'debug';
  }
}