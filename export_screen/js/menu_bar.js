$('#edit_move').click(() => {
  ipcRenderer.send(PATH_DATA.event, PATH_DATA.edit_path)
})
