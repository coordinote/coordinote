'use strict'
// require
const { app, BrowserWindow, protocol, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')

// const
const dirname = '__dirname'
const PATH_DATA = JSON.parse(fs.readFileSync('./screen_info.json', 'utf-8'))

// global
let win

app.on('ready', () => {
  protocol.interceptFileProtocol('file', (req, callback) => {
    let requrl = req.url.substr(7)

    // ルート以下の1番目を抽出
    if(requrl.split('/')[1] === dirname) {
      // __dirnameをパース
      requrl = requrl.replace(/__dirname/, __dirname)
    }
    callback(requrl)
  })
})

function createWindow(){
  win = new BrowserWindow({
    'width': 1200,
    'height': 800,
    'icon': './resource/img/icon.png',
  })

  win.loadURL(url.format({
    pathname: __dirname + PATH_DATA.splash_path,
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

ipcMain.on(PATH_DATA.event, (event, req) => {
  switch(req){
    case PATH_DATA.edit_path:
      win.loadURL(url.format({
        pathname: __dirname + PATH_DATA.edit_path,
        protocol: 'file:',
        slashes: true,
      }))
      break
    case PATH_DATA.main_path:
      win.loadURL(url.format({
        pathname: __dirname + PATH_DATA.main_path,
        protocol: 'file:',
        slashes: true,
      }))
      break
    case PATH_DATA.pdf_path:
      win.loadURL(url.format({
        pathname: __dirname + PATH_DATA.pdf_path,
        protocol: 'file:',
        slashes: true,
      }))
      break
    case PATH_DATA.settings_path:
      win.loadURL(url.format({
        pathname: __dirname + PATH_DATA.settings_path,
        protocol: 'file:',
        slashes: true,
    }))
    break
  }
})
