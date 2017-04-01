$('.ui.fluid.search.dropdown')
        .dropdown({
            allowAdditions: true
        })

$('#return').click(() => {
    ipcRenderer.send(PATH_DATA.event, PATH_DATA.main_path)
})

$('#right_bar').click(() => {
    $('.ui.right.sidebar')
    .sidebar({
    dimPage: false
})
    .sidebar('setting', 'transition', 'overlay')
    .sidebar('toggle')
})
