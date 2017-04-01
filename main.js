'use strict'

const { app, BrowserWindow, protocol, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')

let win

app.on('ready', () => {
    protocol.interceptFileProtocol('file', (req, callback) => {
        const requestedUrl = req.url.substr(7)

        if (path.isAbsolute(requestedUrl)) {
            callback(path.normalize(path.join(__dirname, requestedUrl)))
        } else {
            callback(requestedUrl)
        }
    })
})

function createWindow(){
    win = new BrowserWindow({
        'width': 1200,
        'height': 800,
        'icon': './resource/img/icon.png',
    })

    win.loadURL(url.format({
        pathname: '/splash_screen/index.html',
        protocol: 'file:',
        slashes: true,
    }))

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit()
    }
})

app.on('activate', () => {
    if(win === null){
        createWindow()
    }
})

const PATH_DATA = JSON.parse(fs.readFileSync('./screen_info.json', 'utf-8'))

ipcMain.on(PATH_DATA.event, (event, req) => {
    switch(req){
        case PATH_DATA.edit_path:
            win.loadURL(url.format({
                pathname: PATH_DATA.edit_path,
                protocol: 'file:',
                slashes: true,
            }))
            break
        case PATH_DATA.main_path:
            win.loadURL(url.format({
                pathname: PATH_DATA.main_path,
                protocol: 'file:',
                slashes: true,
            }))
            break
        case PATH_DATA.pdf_path:
            win.loadURL(url.format({
                pathname: PATH_DATA.pdf_path,
                protocol: 'file:',
                slashes: true,
            }))
            break
        case PATH_DATA.settings_path:
            win.loadURL(url.format({
                pathname: PATH_DATA.settings_path,
                protocol: 'file:',
                slashes: true,
            }))
            break
    }
})







// function createWindow(){
//     let win = new BrowserWindow({
//         'width' : 1200,
//         'height' : 800,
//         'icon' : __dirname + '/img/icon.png',
//     })
//     win.loadURL(url.format({
//         pathname: '/splash_screen/index.html',
//         protocol: 'file:',
//         slashes: true,
//     }))
//     //mainWindow.webContents.openDevTools()

//     ipcMain.on('', (event, req) => {
    
//     })

//     win.on('closed', function(){
//         win = null
//     })
// }

// app.on('ready', createWindow)