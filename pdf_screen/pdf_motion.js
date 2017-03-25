$('.ui.fluid.search.dropdown')
        .dropdown({
            allowAdditions: true
        });

$('#return').click(function(){
    document.location.href = '/main_screen/main.html';
});

$('#right_bar').click(function() {
    $('.ui.right.sidebar')
    .sidebar({
    dimPage: false
})
    .sidebar('setting', 'transition', 'overlay')
    .sidebar('toggle');
});