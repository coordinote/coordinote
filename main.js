'use strict'
// require
const { app, BrowserWindow, protocol, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
//open server
require('./server/app.js')

// const
const dirname = '__dirname'
const PATH_DATA = JSON.parse(fs.readFileSync('./screen_info.json', 'utf-8'))

// global
let win
let spwin

app.on('ready', () => {
  protocol.interceptFileProtocol('file', (req, callback) => {
    let requrl = req.url.substr(7)

    // ルート以下の1番目を抽出
    if(requrl.split('/')[1] === dirname) {
      // /__dirnameをパース
      requrl = requrl.replace(/\/__dirname/, __dirname)
      // URLパラメータを除去
      requrl = requrl.replace(/\?.*/, '')
    }
    // ノーマライズして返す
    callback(path.normalize(requrl))
  })
})

function createWindow(){
  win = new BrowserWindow({
    'width': 1200,
    'height': 800,
    'icon': __dirname + '/resource/img/icon@128px.png',
  })

  win.loadURL(url.format({
    pathname: __dirname + PATH_DATA.main_path,
    protocol: 'file:',
    slashes: true,
  }))

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('load_clip', 'load_test')
  })

  win.on('closed', () => {
    win = null
  })
}

//splash window
function splashWindow(){
  spwin = new BrowserWindow({
    'width': 500,
    'height': 600,
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
    createWindow()
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

ipcMain.on('save_tile', (event, TILE) => {
  for(var i=0; i<TILE.length; i++){
    nedb.set_tile(TILE[i], (save_doc) => {
      console.log(save_doc)
    })
  }
})

ipcMain.on('save_clip', (event, tag) => {
  nedb.set_clip(tag, (newclip) => {
    event.returnValue = newclip._id
  })
})

ipcMain.on('load_clip', (event, clip_id) => {
  console.log(clip_id)
  nedb.get_clip_id(clip_id, (load_doc) => {
    event.returnValue = load_doc
  })
})

