const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io').listen(http)
const nedb_module = require ("../nedb_module")
const async = require('async')
const bodyParser = require('body-parser')

let nedb = new nedb_module()
let readid
let writeid

//set portnumber
const PORTNUMBER = 6277

http.listen(PORTNUMBER,() => {
  console.log('Open 6277')
})

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

app.post('/api/save_tile',(req,res) => {
  nedb.insert_tile(req.body,(save_doc) => {
    res.send(save_doc._id)
  })
})

app.get('/api/rec_tilecon',(req,res) => {
  nedb.find_tile_cidid(req.cid,req.tid,(tile) => {
    res.send(tile.con)
  })
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

  socket.emit("send_connect")

  socket.on('send_writeconnect',() => {
    writeid = socket.id
  })

  socket.on('send_readconnect',(rec) => {
    readid = socket.id
    nedb.find_tile_cidid(rec.cid,rec.tid,(tile) => {
      io.to(writeid).emit('res_reloadevent',tile.con)
    })
  })

  //send pathdata
  socket.on('send_pathdata', (rec) => {
    io.to(readid).emit('res_pathdata', rec)
  })

  //send before button push event
  socket.on('send_beforeevent', () => {
    io.to(readid).emit('res_beforeevent')
  })

  //send after button push event
  socket.on('send_afterevent', (rec) => {
    io.to(readid).emit('res_afterevent', rec)
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
      socket.emit('res_tid',save_doc._id)
    })
  })

  //return all tag
  socket.on('get_allcliptags',() => {
    nedb.find_allclipstags((alltags) => {
      //send all tag
      socket.emit('res_allcliptags',alltags)
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

  socket.on('update_tiletag',(rec) => {
    nedb.update_tiletags_cidid(rec.tag,rec.cid,rec.tid,() => {
    })
  })

  socket.on('update_tilecon',(rec) => {
    nedb.update_tilecon_cidid(rec.con,rec.cid,rec.tid,() => {
    })
  })

  socket.on('update_tilecol',(rec) => {
    nedb.update_tilecol_cidid(rec.col,tile.cid,rec.tid,() => {
    })
  })

  socket.on('update_tileidx',(rec) => {
    nedb.update_tileidx_cidid(rec.idx,rec.cid,rec.tid,() => {
    })
  })

  socket.on('delete_clip',(rec) => {
    nedb.delete_clip_id(rec,() => {
    })
  })

  socket.on('delete_tile',(rec) => {
    nedb.delete_tile_cidid(rec.cid,rec.tid,() => {
    })
  })

  socket.on('update_cliptag',(rec) => {
    nedb.update_cliptags_id(rec.clip_tags,rec.cid,(clip) => {
    })
  })

})
