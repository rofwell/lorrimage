const electron = require('electron')
// Module to control application life.
const app = electron.app
const ipc = electron.ipcMain;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const dialog = electron.dialog;

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const template = [
  {
    label:'Title',
    submenu: [
      {
        label:'Quit',
        role:'quit'
      }
    ]
  },
  {
    label: 'Settings',
    submenu: [
      {
        label:'Change Image',
        click: function() {
          dialog.showOpenDialog({ filters: [
            { name: 'image', extensions: ['png','jpg','jpeg'] }
            ]},
            function(fileNames) {
              if (fileNames === undefined) return;

              var filename = fileNames[0];

              mainWindow.webContents.send('new-image',url.format({
                pathname: filename,
                protocol: 'file:',
                slashes: true
              }));
          });
        }
      },
      {type:'separator'},
      {
        label: 'Less Often',
        accelerator: 'CmdOrCtrl+Plus',
        click: function() {
          mainWindow.webContents.send('plus-cooldown');
        }
      },
      {
        label: 'More Often',
        accelerator: 'CmdOrCtrl+-',
        click: function() {
          mainWindow.webContents.send('minus-cooldown');
        }
      },
      {type:'separator'},
      {
        label: 'Longer Visible',
        accelerator: 'CmdOrCtrl+Option+Plus',
        click: function() {
          mainWindow.webContents.send('plus-time');
        }
      },
      {
        label: 'Shorter Visible',
        accelerator: 'CmdOrCtrl+Option+-',
        click: function() {
          mainWindow.webContents.send('minus-time');
        }
      }
    ]
  }
]

function createWindow () {

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 0, height: 0, frame: false, transparent: true, resizable: false, alwaysOnTop: true})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.setPosition(0,0)
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipc.on('window-move',(event,arg) => {
  mainWindow.setPosition(arg[0],arg[1])
});