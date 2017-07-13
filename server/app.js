const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io').listen(http)
const nedb_module = require ("../nedb_module")

let nedb = new nedb_module()

//set portnumber
const PORTNUMBER=6277

http.listen(PORTNUMBER,() => {
  console.log('Open 6277')
})

app.get(/\/html\/*/,(req,res) => {
  res.sendfile(__dirname + req.url)
})

app.get(/\/css\/*/,(req, res) => {
  res.sendfile(__dirname + req.url)
})

app.get(/\/img\/*/, (req, res) => {
  res.sendfile(__dirname + req.url)
})

app.get(/\/js\/*/,(req,res) => {
  res.sendfile(__dirname + req.url)
})

app.get(/\/node_modules\/*/,(req,res) => {
  let redir = __dirname
  redir = redir.replace(/\/server$/,"")
  res.sendfile(redir + req.url)
})


io.sockets.on('connection',(socket) => {

  //server receive stroke style
  socket.on('pathdata_Floatdata_from_canvas',(Floatdata) => {
    //server send stroke style
    socket.broadcast.emit('pathdata_Floatdata_from_server',Floatdata)
  })

  //server send pointdata
  socket.on('pointdata_from_canvas',(pointdata) => {
    socket.broadcast.emit('pointdata_from_server',pointdata)
  })

  socket.on('pathdata_from_canvas', (req) => {
    socket.broadcast.emit('pathdata_from_server', req)
  })

  //save clip data
  socket.on('save_clip',(tag) => {
    //clip data send DB
    nedb.insert_clip(tag,(newclip) => {
      //send newcilp.id send electron
      socket.emit('return_cid',newclip._id)
    })
  })

  //save tile data
  socket.on('save_tile',(tile) => {
    //tile data send database
    nedb.insert_tile(tile,(save_doc) => {
    })
  })

  //return all tag
  socket.on('req_all_tags',() => {
    nedb.find_allclipstags((alltags) => {
      //send all tag
      socket.emit('return_all_tags',alltags)
    })
  })
})
