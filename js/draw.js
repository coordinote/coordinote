//get canvas id 
var container = $('#canvas')
//tools tolerance
$('#omit').change(() => {
    $('#omit-label').html($('#omit').val())
})
$('#omit-label').html($('#omit').val())

//judge draw
var isDrawing = false
//mouse point
var drawingPoints
//svg path
var drawingPath
//svg path style
var defaultPathStyle = {
    strokeWidth: "3px",
    stroke: "#000000",
    fill: "none"
}

//before and after stack
var array = []

//path style color
$('#red').click(() => {
    defaultPathStyle.stroke = "#ff0000"
})
$('#black').click(() => {
    defaultPathStyle.stroke = "#000000"
})

//path before
$('#before').click(() => {
    //path delete and save
    var save_path = $('path:last').detach()
    //array include savepath and not undefined 
    if(array.indexOf(save_path.get()[0]) != 0){
        if(save_path.get()[0] != undefined){
            //add path in stack array
            array.push(save_path.get()[0])
        }
    }
})
//path after
$('#after').click(() => {
    //path restoration
    container.append(array.getLastVal())
    //delete path in stack array
    array.pop()
})

//mouse click
container.mousedown((e) => {
    //judge true
    isDrawing = true
    //point array definition
    drawingPoints = []
})
//mouse move
container.mousemove((e) => {
    //draw true
    if (isDrawing) {
        //add mouse point
        drawingPoints.push({
            x: e.clientX,
            y: e.clientY
        })
        //drawingPath check existence
        if (drawingPath) {
            drawingPath.remove()
        }
        //create path
        drawingPath = createPath(drawingPoints, parseFloat($('#omit').val()), true)
        //path style setting
        Object.assign(drawingPath.style, defaultPathStyle)
        //add svg path to canvas
        container.append(drawingPath)
    }
})
//mouse up
container.mouseup((e) => {
    //judge false
    isDrawing = false
    //drawingPath null or undefined
    if (!drawingPath) {
        return
    }
    drawingPath = null
    //svg data
    $('#data').empty()
    var svg_data = $('#canvas').html().size()
    $('#data').append(svg_data + "Byte")
})

//create path
function createPath(points, tolerance, highestQuality) {
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    var attribute = SVGCatmullRomSpline.toPath(points.map(point => [point.x, point.y]), tolerance, highestQuality)
    path.setAttributeNS(null, 'd', attribute)
    return path
}

//svg-data size function
String.prototype.size = function() {
  return (new Blob([this], {type: "text/plain"})).size
}

Array.prototype.getLastVal = function (){ 
    return this[this.length -1]
}
