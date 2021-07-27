'use strict';

const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const filePath = path.join(__dirname, '../config.json');

const DEFAULT_CONFIG = {
  CLIENTTXT_PATH: '',
  POE_WINDOW_TITLE: 'Path of Exile',
  DEBUG: false
};

let config = undefined;

function getConfig() {
  if (config) {
    return config;
  }

  try {
    const data = fs.readFileSync(filePath);
    config = JSON.parse(data);
  } catch (err) {
    logger.info('Unable to find/read config.json. Getting default configuration values.');
    config = DEFAULT_CONFIG;
  }

  return config;
}

function setConfig(newConfig) {
  if (!newConfig) {
    return;
  }

  if (!config) {
    getConfig();
  }

  for (const key in newConfig) {
    logger.debug(`setConfig ${key}: ${newConfig[key]}`);
    config[key] = newConfig[key];
  }
  const data = JSON.stringify(config, null, 2);
  fs.writeFileSync(filePath, data);
}

module.exports = { getConfig, setConfig };