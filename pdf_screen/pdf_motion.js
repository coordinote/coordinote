const {ipcRenderer} = require('electron')
const fs = require('fs')

$('.ui.fluid.search.dropdown')
        .dropdown({
            allowAdditions: true
        })

var data = JSON.parse(fs.readFileSync('./screen_info.json', 'utf-8'))

$('#return').click(() => {
    ipcRenderer.send(data.event, data.main_path)
})

$('#right_bar').click(() => {
    $('.ui.right.sidebar')
    .sidebar({
    dimPage: false
})
    .sidebar('setting', 'transition', 'overlay')
    .sidebar('toggle')
})