'use strict'

// require
const NeDB_Modules = require('../nedb_module.js')
let dbmethod = new NeDB_Modules()

// var
let target_cid = "aW2hG7kwoOPfhzkX"

/*
dbmethod.get_tiles_cidtags(target_cid, ['よくわからなかった'], (clips) => {
  console.log(clips)
})
//*/

/*
dbmethod.get_clips_tags(['helloworld', 'test'], (clips) => {
  console.log(clips)
})
//*/

/*
dbmethod.get_alltilestags_cid(target_cid, (tags) => {
  console.log(tags)
})
//*/

/*
dbmethod.get_allclipstags((tags) => {
  console.log(tags)
})
//*/

/*
let instance = {
  "cid": target_cid,
  "idx": 0,
  "col": 321,
  "tag": ["公式", "よくわかった"],
  "sty": "txt",
  "con": '$y = ax => x = \frac{y}{a}$',
  "hoge": "hoge"
}

dbmethod.set_tile(instance, (newdocs) => {
  console.log(newdocs)
})
//*/

/*
   dbmethod.get_tiles_cid(target_cid, (docs) => {
   console.log(docs)
   })
   //*/

/*
dbmethod.get_clip_id(target_cid, (doc) => {
  console.log(doc)
})
//*/

/*
   dbmethod.set_clip(['helloworld', 'coordinote'], (newdocs) => {
   console.log(newdocs)
   })
   //*/

/*
   let instance = {
   "cid": target_cid,
   "idx": 0,
   "col": 321,
   "tag": ["公式", "よくわかった"],
   "sty": "txt",
   "con": '$y = ax => x = \frac{y}{a}$'
   }
   dbmethod.set_tile(instance, (newdocs) => {
   console.log(newdocs)
   })
   //*/
