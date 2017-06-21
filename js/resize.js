var h = window.innerHeight
$('body').css('height', h)

$(window).resize(() => {
    h = window.innerHeight
    $('body').css('height', h)
})
