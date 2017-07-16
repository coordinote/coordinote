$('#omit').change(() => {
  $('#omit-label').html($('#omit').val())
})
$('#omit-label').html($('#omit').val())

//judge draw
let isdraw = false
//mouse point
let drawpoints
//svg path
let drawpath
//svg path style
let pathstyle = {
  strokeWidth: "3px",
  stroke: "#000000",
  fill: "none"
}

//svg path data size
let pathsize

//socket.io
const socket = io.connect()
socket.on('connent',() => {
  socket.emit('send_writeflag')
})

//path infomation variable
let pathinfo

//before and after stack
let history_array = []
//after reset flag
let reset = false

//path style color
$('#red').click(() => {
  pathstyle.stroke = "#ff0000"
})
$('#black').click(() => {
  pathstyle.stroke = "#000000"
})

//path before
$('#before').click(() => {
  reset = false
  //send before event
  socket.emit('send_beforeevent')
  //path delete and save
  let save_path = $('path:last').detach()
  //array include savepath and not undefined
  if(history_array.indexOf(save_path.get()[0]) != 0){
    if(save_path.get()[0] !== undefined){
      //add path in stack array
      history_array.push(save_path.get()[0])
        svgdataSize()
      }
    }
})

//path after
$('#after').click(() => {
  //send after event
  socket.emit('send_afterevent', reset)
  //path restoration
  $('#canvas').append(history_array[history_array.length - 1])
  //delete path in stack array
  history_array.pop()
  svgdataSize()
})

//mouse click
$('#canvas').mousedown((e) => {
  //judge true
  isdraw = true
  //history array delete
  history_array.length = 0
  reset = true
  //point array definition
  drawpoints = []
  //socket send data array
  pathinfo = []
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
  svgdataSize()
  //push svg data of html & path style & size & mouse point array & path tolerance
  pathinfo.push({
    allpath: $('#canvas').html(),
    style: pathstyle,
    size: pathsize,
    point: drawpoints,
    tolerance: parseFloat($('#omit').val())
  })
  //judge false
  isdraw = false
  //drawingPath null or undefined
  if (!drawpath) {
    return
  }
  drawpath = null
  //send path infomation
  socket.emit('send_pathdata', pathinfo[0])
})

//recieve data
socket.on('res_pathdata', (req) => {
  let recpath = createPath(req.point, req.tolerance, true)
  Object.assign(recpath.style, req.style)
  $('#canvas').append(recpath)
  $('#datasize').empty()
  $('#datasize').append(req.size + "Byte")
})

//recieve before event
socket.on('res_beforeevent', () => {
  //path delete and save
  let save_path = $('path:last').detach()
  //array include savepath and not undefined
  if(history_array.indexOf(save_path.get()[0]) != 0){
    if(save_path.get()[0] !== undefined){
      //add path in stack array
      history_array.push(save_path.get()[0])
      svgdataSize()
    }
  }
})

//recieve after event
socket.on('res_afterevent', (req) => {
  //history_array initialize
  if(req){
    history_array.length = 0
  }
  //path restoration
  $('#canvas').append(history_array[history_array.length - 1])
  //delete path in stack array
  history_array.pop()
  svgdataSize()
})

//create path
function createPath(points, tolerance, highestQuality) {
  let path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  let attribute = SVGCatmullRomSpline.toPath(points.map(point => [point.x, point.y]), tolerance, highestQuality)
  path.setAttributeNS(null, 'd', attribute)
  return path
}

//svg data size of html
function svgdataSize(){
  $('#datasize').empty()
  pathsize = encodeURIComponent($('#canvas').html()).replace(/%../g,"x").length
  $('#datasize').append(pathsize + "Byte")
}

socket.on('send_id',(id) => {
  socket.emit('send_sendid',id)
})
