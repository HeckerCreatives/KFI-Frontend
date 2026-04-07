const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const fs = require('fs');

const logFile = path.join(app.getPath('desktop'), 'kfi-debug.log');
function log(msg) {
  fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf',
  };
  return types[ext] || 'application/octet-stream';
}

app.whenReady().then(() => {
  // ✅ confirmed: out is at process.resourcesPath/out
  const outDir = app.isPackaged
    ? path.join(process.resourcesPath, 'out')
    : path.join(__dirname, 'out');

  log('outDir: ' + outDir);

  // Intercept file:// to redirect _next assets to correct location
  protocol.interceptFileProtocol('file', (request, callback) => {
    let filePath = decodeURIComponent(request.url.replace(/^file:\/\/\//, ''));

    if (process.platform === 'win32') {
      filePath = filePath.replace(/\//g, '\\');
    }

    if (fs.existsSync(filePath)) {
      return callback(filePath);
    }

    // File not found — try resolving from outDir
    // Handles cases like C:\_next\static\... → outDir\_next\static\...
    const parts = filePath.split(path.sep);
    const nextIndex = parts.findIndex(p => p === '_next' || p === 'dashboard' || p === 'login');
    if (nextIndex !== -1) {
      const relative = parts.slice(nextIndex).join(path.sep);
      const resolved = path.join(outDir, relative);
      log('Remapped: ' + filePath + ' → ' + resolved);
      if (fs.existsSync(resolved)) {
        return callback(resolved);
      }
    }

    log('NOT FOUND: ' + filePath);
    callback(filePath); // let it fail naturally
  });

  const win = new BrowserWindow({
    width: 1440,
    height: 840,
    show: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });

  // win.webContents.openDevTools();

  const indexPath = path.join(outDir, 'index.html');
  log('Loading: ' + indexPath);

  win.loadFile(indexPath)
    .then(() => log('loadFile success'))
    .catch(err => log('loadFile error: ' + err.message));

  win.once('ready-to-show', () => {
    win.show();
    win.focus();
  });

  win.webContents.on('did-fail-load', (e, code, desc) => log('FAIL: ' + code + ' ' + desc));
  win.webContents.on('did-finish-load', () => log('did-finish-load'));
  win.on('closed', () => log('window closed'));
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

process.on('uncaughtException', (err) => {
  log('UNCAUGHT: ' + err.stack);
});