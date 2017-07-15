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

  socket.on('send_pathdata', (rec) => {
    socket.broadcast.emit('res_pathdata', rec)
  })

  socket.on('send_beforeevent', () => {
    socket.broadcast.emit('res_beforeevent')
  })

  socket.on('send_afterevent', (rec) => {
    socket.broadcast.emit('res_afterevent', rec)
  })

  //save clip data
  socket.on('save_clip',(rec) => {
    //clip data send DB
    nedb.insert_clip(rec,(newclip) => {
      //send newcilp.id send electron
      socket.emit('res_cid',newclip._id)
    })
  })

  //save tile data
  socket.on('save_tile',(rec) => {
    //tile data send database
    nedb.insert_tile(rec,(save_doc) => {
    })
  })

  //return all tag
  socket.on('get_alltags',() => {
    nedb.find_allclipstags((alltags) => {
      //send all tag
      socket.emit('res_alltags',alltags)
    })
  })
})
