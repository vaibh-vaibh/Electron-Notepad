const { ipcRenderer } = require('electron');
const fs = require('fs');

const notepad = document.getElementById('notepad');

// Handle "New" action
ipcRenderer.on('action', (event, action) => {
    if (action === 'new') notepad.value = '';
});

// Handle "Open" action
ipcRenderer.on('open-file', (event, data) => {
    notepad.value = data;
});

// Handle "Save" action
ipcRenderer.on('save-file', (event, filePath) => {
    fs.writeFile(filePath, notepad.value, (err) => {
        if (err) console.error('Error saving file:', err);
    });
});

// Handle "Word Wrap" toggle
ipcRenderer.on('toggle-wrap', (event, isWrapped) => {
    notepad.style.whiteSpace = isWrapped ? 'pre-wrap' : 'pre';
});
