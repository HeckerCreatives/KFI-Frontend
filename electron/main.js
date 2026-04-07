const { app, BrowserWindow } = require('electron');
const path = require('path');

const isDev = !app.isPackaged;

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // required for loading local files
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // log the path to verify it's correct
    const indexPath = path.join(__dirname, '../out/index.html');
    console.log('Loading:', indexPath);
    
    mainWindow.loadFile(indexPath).catch(err => {
      console.error('Failed to load:', err);
    });

    // open devtools in prod temporarily to debug
    mainWindow.webContents.openDevTools();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});