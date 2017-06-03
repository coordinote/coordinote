//get canvas id 
var container = document.getElementById('canvas')

//judge draw
var isDrawing = false
//mouse point
var drawingPoints
//svg path
var drawingPath
//svg path style
var defaultPathStyle = {
    strokeWidth: "3px",
    stroke: "#000",
    fill: "none",
}

//mouse click
container.addEventListener('mousedown', function(e) {
    //judge true
    isDrawing = true
    //point array definition
    drawingPoints = []
})
//mouse move
container.addEventListener('mousemove', function(e) {
    //draw true
    if (isDrawing) {
        //add mouse point
        drawingPoints.push({
            x: e.clientX,
            y: e.clientY
        })
        //drawingPath check existence
        if (drawingPath) {
            container.removeChild(drawingPath)
        }
        //create path
        drawingPath = createPath(drawingPoints)
        //path style setting
        Object.assign(drawingPath.style, defaultPathStyle)
        //add svg path to canvas
        container.appendChild(drawingPath)
    }
})
//mouse up
container.addEventListener('mouseup', function(e) {
    //judge false
    isDrawing = false
    //drawingPath null or undefined
    if (!drawingPath) {
        return
    }
    //rebuilding
    container.removeChild(drawingPath)
    drawingPath = null
    var path
    path = createPath(drawingPoints)
    Object.assign(path.style, defaultPathStyle)
    container.appendChild(path)
})

//create path
function createPath(points) {
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    var attribute = ''
    points.forEach((point, index) => {
        if (index === 0) {
            attribute += `M${point.x}, ${point.y}`
        } else {
            attribute += `L${point.x}, ${point.y}`
        }
    })
    path.setAttributeNS(null, 'd', attribute)
    return path
}