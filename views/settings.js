const { ipcRenderer } = require('electron');

// button handling

$('#button-close').on('click', function(e) {
  ipcRenderer.send('web-settings-close');
});

$('#button-save').on('click', function(e) {
  const CLIENTTXT_PATH = $('#input-clienttxt-text').val();
  const POE_WINDOW_TITLE = $('#input-poe-window-title').val();
  const DEBUG = $('#input-debug').is(":checked");

  ipcRenderer.send('web-settings-close', { CLIENTTXT_PATH, POE_WINDOW_TITLE, DEBUG });
});

$('#input-clienttxt-file').on('change', function (e) {
  const fileObject = e.target.files[0];
  if (fileObject) {
    $('#input-clienttxt-text').val(fileObject.path);
  }
});

// web event handling

ipcRenderer.on('web-settings', (event, config) => {
  $('#input-clienttxt-text').val(config.CLIENTTXT_PATH);
  $('#input-poe-window-title').val(config.POE_WINDOW_TITLE);
  $('#input-debug').prop('checked', config.DEBUG);
});
