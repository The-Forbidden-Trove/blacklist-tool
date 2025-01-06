'use strict';

require('./poever.js')

const EventEmitter = require('events');

require('./controllers/config');
const Overlay = require('./controllers/overlay');
const ClientLog = require('./controllers/client-log');
const Blacklist = require('./controllers/blacklist');

async function start() {
  const eventEmitter = new EventEmitter();
  await Overlay(eventEmitter);
  ClientLog(eventEmitter);
  Blacklist(eventEmitter);
}

start();