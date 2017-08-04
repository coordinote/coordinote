const remote = require('electron').remote

$('.edit').click(() => {
  ipcRenderer.send('move_from_splash', PATH_DATA.edit_path)
  let window = remote.getCurrentWindow()
  window.close()
})

$('.export').click(() => {
  ipcRenderer.send('move_from_splash', PATH_DATA.export_path)
  let window = remote.getCurrentWindow()
  window.close()
})

// version 書き出し
$('#version').text('ver ' + require('../package.json').version)

// author 書き出し
$('#author').text('Author: maturu, amataku, rikyuusima, Syaz0326')

