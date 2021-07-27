'use strict';

const path = require('path');
const { app, shell, globalShortcut, ipcMain, BrowserWindow, Tray, nativeImage, Menu } = require('electron');
const { overlayWindow } = require('electron-overlay-window');

const { createWindow: createSettingsWindow } = require('./settings');
const { POE_WINDOW_TITLE } = require('../util/config').getConfig();
const logger = require('../util/logger');

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async (eventEmitter) => {

  /**
   * Window Setup
   */

  let window, tray;

  async function createWindow() {
    window = new BrowserWindow({
      width: 400,
      height: 300,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      },
      ...overlayWindow.WINDOW_OPTS
    });

    await window.loadFile('./views/overlay.html');

    window.setIgnoreMouseEvents(true, { forward: true });

    if (process.env.NODE_ENV === 'development') {
      setDevelopmentKeyBindings();
      window.webContents.openDevTools({ mode: 'detach', activate: false })
    }

    overlayWindow.attachTo(window, POE_WINDOW_TITLE);
  }

  function setDevelopmentKeyBindings () {

    globalShortcut.register('CmdOrCtrl + H', () => {
      const type = 'error';
      const message = `(Demo) You are engaging with a blacklisted user in TFT: ${new Date().getTime()}`;

      window.webContents.send('web-notify', { type, message });

      logger.debug(`web-notify (${type}) ${message}`);
    });

    globalShortcut.register('CmdOrCtrl + J', () => {
      window.webContents.send('web-toggle');
    });

  }

  /**
   * Tray Setup
   */

  async function createTray() {
    tray = new Tray(nativeImage.createFromPath(path.join(__dirname, '../views/tft-50.png')));

    const contextMenu = Menu.buildFromTemplate([
      {
        label: `TFT Blacklist v${app.getVersion()}`,
        // enabled: false,
        icon: nativeImage.createFromPath(path.join(__dirname, '../views/tft-20.png')),
        click: () => {
          shell.openExternal('https://github.com/The-Forbidden-Trove/blacklist-tool/releases');
        }
      },
      { type: 'separator' },
      {
        label: `Settings`,
        click: () => {
          createSettingsWindow();
        }
      },
      /*
      {
        label: 'Check for Update',
        click: () => {
          shell.openExternal('https://github.com/The-Forbidden-Trove/blacklist-tool/releases');
        }
      },
      */
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => { app.quit(); }
      }
    ]);

    tray.setToolTip('TFT Blacklist');
    tray.setContextMenu(contextMenu);
  }

  /**
   * Event Setup
   */

  eventEmitter.on('app-notify-success', (message) => {
    const type = 'success';

    window.webContents.send('web-notify', { type: 'success', message });

    logger.debug(`web-notify (${type}) ${message}`);
  });

  eventEmitter.on('app-notify-error', (message) => {
    const type = 'warning';

    window.webContents.send('web-notify', {
      type, message,
      options: { timeOut: 0, extendedTimeOut: 0 }
    });

    logger.debug(`web-notify (${type}) ${message}`);
  });

  eventEmitter.on('app-notify-blacklist', (ign) => {
    const type = 'error';
    const message = `You are engaging with a blacklisted user in TFT: ${ign}`;

    window.webContents.send('web-notify', { type, message });

    logger.debug(`web-notify (${type}) ${message}`);
  });

  ipcMain.on('web-mouse', (event, isMouseEnter) => {
    if (isMouseEnter) {
      window.setIgnoreMouseEvents(false);
      overlayWindow.activateOverlay();
    } else {
      window.setIgnoreMouseEvents(true, { forward: true });
      overlayWindow.focusTarget();
    }
  });

  /**
   * App Setup
   */

  app.disableHardwareAcceleration(); // https://github.com/electron/electron/issues/25153

  app.on('ready', function () {
    createTray();
  });

  app.on('activate', function () {
    // https://www.electronjs.org/docs/tutorial/quick-start#open-a-window-if-none-are-open-macos
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  /*
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
  */

  await app.whenReady();

  // https://github.com/electron/electron/issues/16809
  await timeout(process.platform === 'linux' ? 1000 : 0);

  await createWindow();
};