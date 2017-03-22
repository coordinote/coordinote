'use strict';

const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const url = require('url');

app.on('ready', () => {
    protocol.interceptFileProtocol('file', (req, callback) => {
        const requestedUrl = req.url.substr(7);

        if (path.isAbsolute(requestedUrl)) {
            callback(path.normalize(path.join(__dirname, requestedUrl)));
        } else {
            callback(requestedUrl);
        }
    });
});

function createWindow(){
    let win = new BrowserWindow({
        'width' : 1200,
        'height' : 800,
        'icon' : __dirname + '/img/icon.png',
    });
    win.loadURL(url.format({
        pathname: '/splash_screen/index.html',
        protocol: 'file:',
        slashes: true,
    }));
    //mainWindow.webContents.openDevTools();

    win.on('closed', function(){
        win = null;
    });
}

app.on('ready', createWindow);