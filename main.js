const { app, BrowserWindow, Tray, Menu, Notification, nativeImage } = require('electron');
const path = require('path');

let tray = null;
let mainWindow;

app.setName('Cyber Snake');
app.setVersion('1.0.0');

app.setAboutPanelOptions({
  applicationName: 'Cyber Snake',
});

// Create the main browser window
async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 992,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false
    },
    icon: path.join(__dirname, 'assets/favicon/apple-icon-180x180.png'),
    frame: true,
    autoHideMenuBar: true,
    show: false  // Show later after ready
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

}

// Create the tray icon and menu
function createTray() {
  const trayIcon = nativeImage.createFromPath(
    path.join(__dirname, 'assets/favicon/apple-icon-180x180.png')
  ).resize({ width: 16, height: 16 });

  tray = new Tray(trayIcon);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => mainWindow.show() },
    { label: 'Quit', click: () => app.quit() }
  ]);

  tray.setToolTip('Cyber Snake');
  tray.setContextMenu(contextMenu);
}

// Schedule a placeholder notification (can be removed/edited later)
function scheduleMorningNotification() {
  if (Notification.isSupported()) {
    new Notification({
      title: 'Cyber Snake',
      body: 'Cyber Snake is running in the background.'
    }).show();
  }
}

// Electron lifecycle
app.whenReady().then(() => {
  createWindow();
  createTray();
  scheduleMorningNotification();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});