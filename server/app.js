const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io').listen(http)
const nedb_module = require ("../nedb_module")
const async = require('async')

let nedb = new nedb_module()
let readid
let writeid

//set portnumber
const PORTNUMBER = 6277

http.listen(PORTNUMBER,() => {
  console.log('Open 6277')
})

app.get('/',(req,res) => {
  res.sendfile('./server/index.html')
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

  socket.on('send_readflag',() => {
    readid = socket.id
    socket.broadcast.emit('send_id',readid)
  })

  socket.on('send_writeflag',() => {
    writeid = socket.id
    socket.broadcast.emit('send_writeid',writeid)
  })


  //send pathdata
  socket.on('send_recid',(rec) => {
    socket.on('send_sendid',(rec1) => {
      socket.on('send_pathdata', (rec2) => {
        let checkid = socket.id
        if(writeid == checkid){
          console.log("hello")
          io.to(rec1).emit('res_pathdata', rec2)
        }
      })
    })
  })

  //send before button push event
  socket.on('send_beforeevent', () => {
    socket.broadcast.emit('res_beforeevent')
  })

  //send after button push event
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

  //return all tile tags
  socket.on('send_clipsearchdata',(rec) => {
    nedb.find_clipids_tags(rec.cliptags,new Date(rec.startdate),new Date(rec.enddate),(cids) => {
      let tiletags = []
      async.each(cids,(cid,callback) => {
            nedb.find_alltilestags_cid(cid._id,(tiletag) => {
              tiletags = tiletags.concat(tiletag)
              callback()
            })
        },
        (err) => {
          if(err){
            console.error(err)
          }
          let alltiletags = Array.from(new Set(tiletags).values())
          socket.emit('res_alltiletags',alltiletags)
      })
    })
  })

  //return search clip
  socket.on('send_clipsearchdata',(rec) => {
    nedb.find_clips_tags(rec.cliptags,new Date(rec.startdate),new Date(rec.enddate),(clips) => {
      socket.emit('res_clips',clips)
    })
  })

  //return search tile
  socket.on('send_tilesearchdata',(rec) => {
    nedb.find_clipids_tags(rec.cliptags,new Date(rec.startdate),new Date(rec.enddate),(cids) => {
      let tiles = []
      async.each(cids,(cid,callback) => {
            nedb.find_tiles_cidtags(cid._id,rec.tiletags,(tile) => {
              tiles = tiles.concat(tile)
              callback()
            })
        },
        (err) => {
          if(err){
            console.error(err)
          }
          socket.emit('res_tiles',tiles)
      })
    })
  })

})
