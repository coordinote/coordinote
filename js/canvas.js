//get canvas&context
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

// canvas size
function canvas_resize(){
    var w = window.innerWidth
    var h = window.innerHeight
    canvas.setAttribute('width',w)
    canvas.setAttribute('height',h)
}
window.addEventListener('resize',canvas_resize,false)
canvas_resize()

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

//menu icon
var menuIcon = document.getElementsByClassName('menuicon')
for (i = 0; i < menuIcon.length; i++) {
    menuIcon[i].addEventListener('click', canvasMenu, false)
}

// menu buttons
function canvasMenu() {
    //id
    var thisId = this.id
    //line size
    if (thisId.indexOf('size') + 1) {
        linesize = ~~this.id.slice(4, this.id.length)
    }
    //line color
    if (thisId.indexOf("color") + 1) {
            linecolor = "#" + this.id.slice(5, this.id.length);
    }
    //line alpha
    if (thisId.indexOf("alpha") + 1) {
        linealpha = (~~this.id.slice(5, this.id.length)) / 10;
    }
}