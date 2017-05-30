//get canvas&context
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

//default line style
var linesize = 7
var linecolor = "#000000"
var linealpha = 1.0

//mouse
var mouse_x = ""
var mouse_y = ""

//mouse event
canvas.addEventListener('mousemove', onMove, false)
canvas.addEventListener('mousedown', onClick, false)
canvas.addEventListener('mouseup', drawEnd, false)
canvas.addEventListener('mouseout', drawEnd, false)

function onMove(e) {
    if (e.buttons === 1 || e.witch === 1) {
        let rect = e.target.getBoundingClientRect()
        let x = ~~(e.clientX - rect.left)
        let y = ~~(e.clientY - rect.top)
        //draw mouse
        draw(x, y)
    }
}

function onClick(e) {
    let rect = e.target.getBoundingClientRect()
    let x = ~~(e.clientX - rect.left)
    let y = ~~(e.clientY - rect.top)
    //draw mouse
    draw(x, y)
}

function drawEnd() {
    mouse_x = ""
    mouse_y = ""
}

function draw(x, y) {
    context.beginPath()
    context.globalAlpha = linealpha
    //if mouse value
    if (mouse_x === "") {
        context.moveTo(x, y)
    } else {
        context.moveTo(mouse_x, mouse_y)
    }
    //line goal
    context.lineTo(x, y)
    context.stroke()
    //line radius, size, color
    context.lineCap = "round"
    context.lineWidth = linesize * 2
    context.strokeStyle = linecolor
    //mouse(x, y)
    mouse_x = x
    mouse_y = y
}
