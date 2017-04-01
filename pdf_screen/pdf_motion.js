$('.ui.fluid.search.dropdown')
        .dropdown({
            allowAdditions: true
<<<<<<< HEAD
        });

$('#return').click(function(){
    document.location.href = '/main_screen/main.html';
});

$('#right_bar').click(function() {
=======
        })

$('#return').click(() => {
    ipcRenderer.send(PATH_DATA.event, PATH_DATA.main_path)
})

$('#right_bar').click(() => {
>>>>>>> master
    $('.ui.right.sidebar')
    .sidebar({
    dimPage: false
})
    .sidebar('setting', 'transition', 'overlay')
<<<<<<< HEAD
    .sidebar('toggle');
});
=======
    .sidebar('toggle')
})
>>>>>>> master
