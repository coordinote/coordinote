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

$('#pdf').click(() => {
    ipcRenderer.send(PATH_DATA.event, PATH_DATA.pdf_path)
})

$('#edit').click(() => {
  ipcRenderer.send(PATH_DATA.event, PATH_DATA.edit_path)
})
