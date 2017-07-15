const remote = require('electron').remote
setTimeout(() => {
  var window = remote.getCurrentWindow()
  window.close()
}, 5000)
