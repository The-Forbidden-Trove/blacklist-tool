'use strict'

const axios = require('axios').default;
const logger = require('../util/logger');
const { BLACKLIST_IGN } = require('../util/config').getConfig();

const BLACKLIST_URL = 'https://raw.githubusercontent.com/The-Forbidden-Trove/character_name_blacklist/main/blacklist.txt';
const BLACKLIST_UPDATE_INTERVAL = 1800000;

module.exports = (eventEmitter) => {

  async function getBlacklist() {
    try {
      const response = await axios.get(BLACKLIST_URL);

      const blacklist = response.data.split('\n');

      if (BLACKLIST_IGN) {
        logger.debug(`BLACKLIST_IGN: ${BLACKLIST_IGN}`);
        blacklist.push(BLACKLIST_IGN);
      }

      eventEmitter.emit('app-blacklist-update', blacklist);

    } catch (err) {
      logger.error(`blacklist.js | ${err}`);
      if (err.response) {
        logger.error(`blacklist.js http header | ${JSON.stringify(err.response.headers, null, 2)}`);
        logger.error(`blacklist.js http data   | ${JSON.stringify(err.response.data)}`);
      } else {
        logger.error(err);
      }
    }
  }

  function getBlacklistLoop() {
    try {
      getBlacklist();
    } finally {
      setTimeout(getBlacklistLoop, BLACKLIST_UPDATE_INTERVAL);
    }
  }

  getBlacklistLoop();

};