const { app, BrowserWindow, Menu, dialog } = require('electron');
const fs = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadFile('index.html');
}

// Menu template to include File, Edit, Format, View, and Help options
const menuTemplate = [
    {
        label: 'File',
        submenu: [
            { label: 'New', click: () => mainWindow.webContents.send('action', 'new') },
            { label: 'Open', click: () => openFile() },
            { label: 'Save', click: () => saveFile() },
            { type: 'separator' },
            { label: 'Exit', role: 'quit' }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'selectAll' }
        ]
    },
    {
        label: 'Format',
        submenu: [
            {
                label: 'Word Wrap',
                type: 'checkbox',
                checked: true,
                click: (menuItem) => mainWindow.webContents.send('toggle-wrap', menuItem.checked)
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'togglefullscreen' },
            { type: 'separator' },
            { role: 'reload' },
            { role: 'toggledevtools' }
        ]
    },
    {
        label: 'Help',
        submenu: [
            {
                label: 'About Notepad',
                click: () => {
                    dialog.showMessageBox({
                        type: 'info',
                        title: 'About',
                        message: 'This is a basic Notepad clone built with Electron.',
                        buttons: ['OK']
                    });
                }
            }
        ]
    }
];

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

app.on('ready', createWindow);

// Functions for file handling
async function openFile() {
    const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openFile'] });
    if (!canceled && filePaths.length > 0) {
        fs.readFile(filePaths[0], 'utf8', (err, data) => {
            if (!err) mainWindow.webContents.send('open-file', data);
        });
    }
}

async function saveFile() {
    const { canceled, filePath } = await dialog.showSaveDialog();
    if (!canceled && filePath) {
        mainWindow.webContents.send('save-file', filePath);
    }
}
