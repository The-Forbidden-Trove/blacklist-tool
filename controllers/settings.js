'use strict';

const { BrowserWindow, nativeImage, ipcMain } = require('electron');
const Config = require('../util/config');
const logger = require('../util/logger');

let window;

function createWindow() {

  if (window) {
    try {
      window.focus();
    } catch {
      window = undefined;
      createWindow();
    }
    return;
  }

  window = new BrowserWindow({
    width: 600,
    height: 300,
    icon: nativeImage.createFromPath('./views/tft-20x16.png'),
    fullscreenable: false,
    frame: false,
    titleBarStyle: 'customButtonsOnHover',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  window.loadFile('./views/settings.html');

  if (process.env.NODE_ENV === 'development') {
    window.webContents.openDevTools({ mode: 'detach', activate: false })
  }

  window.once('ready-to-show', () => {
    window.webContents.send('web-settings', Config.getConfig());

    window.show();
  });
}

function closeWindow() {
  if (window) {
    window.close();
    window = undefined;
  }
}

/**
 * Event Setup
 */

ipcMain.on('web-settings-close', (event, config) => {
  if (config) {
    Config.setConfig(config);
  }

  closeWindow();
});

module.exports = {
  createWindow,
  closeWindow
};
