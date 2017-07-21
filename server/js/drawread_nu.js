//svg path data size
let pathsize

// svg path data
let pathdata = []

//before and after stack
let history_array = []

// svg path data (before and after stack)
let history_array_pathdata = []

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

// load path
function loadPath(load_pathdata){
  $('#canvas').empty()
  if(load_pathdata !== undefined){
    for(let path of load_pathdata){
      let recpath = createPath(path.point, path.tolerance, true)
      Object.assign(recpath.style, path.style)
      $('#canvas').append(recpath)
    }
  }
  // load to variable
  pathdata = load_pathdata
  svgdataSize()
}

