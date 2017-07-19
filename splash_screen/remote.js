const remote = require('electron').remote
/*setTimeout(() => {
  var window = remote.getCurrentWindow()
  window.close()
}, 5000)*/

$('.edit').click(() => {
  ipcRenderer.send('move_from_splash', PATH_DATA.edit_path)
  var window = remote.getCurrentWindow()
  window.close()
})

$('.export').click(() => {
  ipcRenderer.send('move_from_splash', PATH_DATA.pdf_path)
  var window = remote.getCurrentWindow()
  window.close()
})
