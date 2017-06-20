//tools tolerance
$('#omit').change(() => {
    $('#omit-label').html($('#omit').val())
})
$('#omit-label').html($('#omit').val())

//judge draw
var isdraw = false
//mouse point
var drawpoints
//svg path
var drawpath
//svg path style
var pathstyle = {
    strokeWidth: "3px",
    stroke: "#000000",
    fill: "none"
}

//before and after stack
var history_array = []

//path style color
$('#red').click(() => {
    pathstyle.stroke = "#ff0000"
})
$('#black').click(() => {
    pathstyle.stroke = "#000000"
})

//path before
$('#before').click(() => {
    //path delete and save
    var save_path = $('path:last').detach()
    //array include savepath and not undefined 
    if(history_array.indexOf(save_path.get()[0]) != 0){
        if(save_path.get()[0] !== undefined){
            //add path in stack array
            history_array.push(save_path.get()[0])
        }
    }
})
//path after
$('#after').click(() => {
    //path restoration
    $('#canvas').append(history_array.getLastVal())
    //delete path in stack array
    history_array.pop()
})

//mouse click
$('#canvas').mousedown((e) => {
    //judge true
    isdraw = true
    //point array definition
    drawpoints = []
})
//mouse move
$('#canvas').mousemove((e) => {
    //draw true
    if (isdraw) {
        //add mouse point
        drawpoints.push({
            x: e.clientX,
            y: e.clientY
        })
        //drawingPath check existence
        if (drawpath) {
            drawpath.remove()
        }
        //create path
        drawpath = createPath(drawpoints, parseFloat($('#omit').val()), true)
        //path style setting
        Object.assign(drawpath.style, pathstyle)
        //add svg path to canvas
        $('#canvas').append(drawpath)
    }
})
//mouse up
$('#canvas').mouseup((e) => {
    //judge false
    isdraw = false
    //drawingPath null or undefined
    if (!drawpath) {
        return
    }
    drawpath = null
    //svg data
    $('#datasize').empty()
    var svg_data = $('#canvas').html().size()
    $('#datasize').append(svg_data + "Byte")
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

Array.prototype.getLastVal = function() {
    return this[this.length -1]
}
