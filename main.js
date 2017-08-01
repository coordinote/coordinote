'use strict'
// require
const { app, BrowserWindow, protocol, ipcMain } = require('electron')
const path = require('path')
const url = require('url')

//open server
require('./server/app.js')

// const
const dirname = '__dirname'
const PATH_DATA = require('./common.js').PATH_DATA

// global
let win
let spwin

app.on('ready', () => {
  protocol.interceptFileProtocol('file', (req, callback) => {
    let requrl
    switch (process.platform){
      case "win32":
        requrl = req.url.substr(8)

        // ルート以下の1番目を抽出
        requrl = requrl.replace(/.:\/__dirname/, __dirname)
        requrl = requrl.replace(/__dirname/, __dirname)
        // URLパラメータを除去
        requrl = requrl.replace(/\?.*/, '')
        console.log(requrl)
        break
      default:
        requrl = req.url.substr(7)

        // ルート以下の1番目を抽出
        requrl = requrl.replace(/\/__dirname/, __dirname)
        // URLパラメータを除去
        requrl = requrl.replace(/\?.*/, '')
    }
    callback(requrl)
  })
})

function createWindow(path){
  win = new BrowserWindow({
    'width': 1200,
    'height': 800,
    'icon': __dirname + '/resource/img/icon@128px.png'
  })

  win.loadURL(url.format({
    pathname: __dirname + path,
    protocol: 'file:',
    slashes: true
  }))

  win.on('closed', () => {
    win = null
  })
}

//splash window
function splashWindow(){
  spwin = new BrowserWindow({
    'width': 510,
    'height': 629,
    'transparent': true,
    'frame': false,
    "resizable": false
  })

  spwin.loadURL(url.format({
    pathname: __dirname + PATH_DATA.splash_path,
    protocol: 'file:',
    slashes: true
  }))

  spwin.on('closed', () => {
    spwin = null
  })
}

app.on('ready', splashWindow)

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
        slashes: true
      }))
      break
    case PATH_DATA.main_path:
      win.loadURL(url.format({
        pathname: __dirname + PATH_DATA.main_path,
        protocol: 'file:',
        slashes: true
      }))
      break
    case PATH_DATA.export_path:
      win.loadURL(url.format({
        pathname: __dirname + PATH_DATA.export_path,
        protocol: 'file:',
        slashes: true
      }))
      break
    case PATH_DATA.settings_path:
      win.loadURL(url.format({
        pathname: __dirname + PATH_DATA.settings_path,
        protocol: 'file:',
        slashes: true
    }))
    break
  }
})

ipcMain.on('move_from_splash', (event, path) => {
  switch(path){
    case PATH_DATA.edit_path:
      createWindow(path)
      break
    case PATH_DATA.export_path:
      createWindow(path)
      break
  }
})

