const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const fs = require('fs');

const logFile = path.join(__dirname, 'electron-debug.log');
function log(msg) {
  fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);
  console.log(msg);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });

  // Intercept file:// requests and strip crossorigin from HTML
  win.webContents.session.protocol.interceptBufferProtocol('file', (request, callback) => {
    let filePath = decodeURIComponent(request.url.replace('file:///', ''));

    // Windows fix: normalize path
    if (process.platform === 'win32') {
      filePath = filePath.replace(/\//g, '\\');
    }

    if (!fs.existsSync(filePath)) {
      return callback({ error: -6 }); // FILE_NOT_FOUND
    }

    let data = fs.readFileSync(filePath);

    // For HTML files, strip crossorigin attributes that break file:// loading
    if (filePath.endsWith('.html')) {
      let html = data.toString('utf8');
      html = html.replace(/\s*crossorigin="[^"]*"/g, '');
      html = html.replace(/\s*crossorigin/g, '');
      data = Buffer.from(html, 'utf8');
    }

    callback({ data, mimeType: getMimeType(filePath) });
  });

  const indexPath = path.join(__dirname, 'out', 'index.html');
  log('Loading: ' + indexPath);

  win.loadFile(indexPath)
    .then(() => log('Loaded'))
    .catch(err => log('Error: ' + err.message));

  win.once('ready-to-show', () => win.show());

  win.webContents.on('dom-ready', () => {
    win.webContents.openDevTools();
  });

  win.webContents.on('did-fail-load', (e, code, desc) => {
    log('Failed: ' + code + ' ' + desc);
  });
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.html': 'text/html',
    '.js':   'application/javascript',
    '.css':  'text/css',
    '.json': 'application/json',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.svg':  'image/svg+xml',
    '.woff2':'font/woff2',
    '.woff': 'font/woff',
    '.ttf':  'font/ttf',
  };
  return types[ext] || 'application/octet-stream';
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});