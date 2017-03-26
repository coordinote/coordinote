const {ipcRenderer} = require('electron')
const fs = require('fs')

$('#bottom_bar').click(() => {
  $('.ui.bottom.sidebar')
  .sidebar({
    dimPage: false,
    closable: false
  })
  .sidebar('setting', 'transition', 'overlay')
  .sidebar('toggle')
})

$('#left_bar').click(() => {
  $('.ui.left.sidebar')
  .sidebar({
    dimPage: false,
    closable: false
  })
  .sidebar('toggle')
})

var data = JSON.parse(fs.readFileSync('./screen_info.json', 'utf-8'))

$('#pdf').click(() => {
    ipcRenderer.send(data.event, data.pdf_path)
})