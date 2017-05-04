var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');

var down = false;
function onDown(e) {
    down = true;
    console.log("down");
    context.beginPath();
    context.moveTo(e.clientX, e.clientY);
}
function onMove(e) {
    if (!down) return;
    console.log("mousemove");
    context.lineTo(e.clientX, e.clientY);
    context.stroke();
}
function onUp(e) {
    if (!down) return;
    context.lineTo(e.clientX, e.clientY);
    context.stroke();
    context.closePath();
    down = false;
    console.log("up");
}

canvas.addEventListener('mousedown', onDown, false);
canvas.addEventListener('mouseup', onUp, false);
canvas.addEventListener('mousemove', onMove, false);