const remote = require('electron').remote

$('.edit').click(() => {
  ipcRenderer.send('move_from_splash', PATH_DATA.edit_path)
  let window = remote.getCurrentWindow()
  window.close()
})

$('.export').click(() => {
  ipcRenderer.send('move_from_splash', PATH_DATA.pdf_path)
  let window = remote.getCurrentWindow()
  window.close()
})
