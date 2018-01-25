import { app, BrowserWindow, dialog, Menu, MenuItemConstructorOptions, net } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as request from 'request';

const development = dotenv.config({ path: path.join(__dirname, '.env') }).parsed.ECLOGITE_DEVELOPMENT !== '0';

interface Package {
  version: string;
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow;

function readPackage(): Promise<Package> {
  return new Promise<Package>((resolve, reject) => {
    const p = path.join(__dirname, 'package.json');
    fs.readFile(p, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      try {
        resolve(JSON.parse(data.toString()));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function createWindow(): void {
  win = new BrowserWindow({ width: 800, height: 600 });

  if (development) {
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Open the DevTools when debug mode.
  if (development) {
    win.webContents.openDevTools({ mode: 'undocked' });
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

function setMenu() {
  const template: MenuItemConstructorOptions[] = [
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: (item, focusedWindow) => focusedWindow.reload(),
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'CmdOrCtrl+Shift+I',
          click: (item, focusedWindow) => {
            if (focusedWindow.webContents.isDevToolsOpened()) {
              focusedWindow.webContents.closeDevTools();
            } else {
              focusedWindow.webContents.openDevTools();
            }
          },
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: async (item, focusedWindow) => {
            const p = await readPackage();
            dialog.showMessageBox(
              focusedWindow,
              {
                type: 'info',
                buttons: ['OK'],
                title: 'About Eclogite',
                message: `Version: ${p.version}`,
              },
              (a, b) => {
                console.log(a, b);
              }
            );
          },
        },
        {
          label: 'Issue HTTP Request via net module of Electron',
          click: (item, focusedWindow) => {
            const req = net.request('https://github.com/electron/electron/blob/v1.8.1/docs/api/net.md');
            req.on('response', response => {
              console.log(`STATUS: ${response.statusCode}`);
              console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
              response.on('data', chunk => {
                // console.log(`BODY: ${chunk}`);
              });
              response.on('end', () => {
                console.log('No more data in response.');
              });
            });
            req.end();
          },
        },
        {
          label: 'Issue HTTP Request via request module of Node',
          click: (item, focusedWindow) => {
            request.get(
              'http://garoon4.intra.cyberlinks.ad.jp/cgi-bin/cl_cbgrn4/grn.cgi/schedule/index?',
              (err, res, body) => {
                console.log(err, body);
              }
            );

          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
  setMenu();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});
