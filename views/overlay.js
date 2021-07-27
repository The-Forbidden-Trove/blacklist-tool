const { ipcRenderer } = require('electron');

const toastr = require('toastr');

// toast options

toastr.options = {
  closeButton: false,
  debug: false,
  newestOnTop: false,
  progressBar: true,
  positionClass: 'toast-top-left',
  preventDuplicates: true,
  showDuration: 100,
  hideDuration: 100,
  timeOut: 10000,
  extendedTimeOut: 2000,
  showEasing: 'swing',
  hideEasing: 'swing',
  showMethod: 'fadeIn',
  hideMethod: 'fadeOut',
  onCloseClick: (event) => {
    ipcRenderer.send('web-mouse', false);
  }
};


// web event handling

ipcRenderer.on('web-notify', (event, { type, message, options }) => {

  const element = toastr[type](message, 'TFT Blacklist', options);
  if (element) {
    element
      .on('mouseenter', () => ipcRenderer.send('web-mouse', true))
      .on('mouseleave', () => ipcRenderer.send('web-mouse', false));
  }

});

ipcRenderer.on('web-toggle', (event) => {

  const borderDiv = document.getElementById('div-border');
  const devDiv = document.getElementById('div-dev');

  if (borderDiv.style.display) {
    borderDiv.style.display = null;
    devDiv.style.display = null;
  } else {
    borderDiv.style.display = 'none';
    devDiv.style.display = 'none';
  }

});