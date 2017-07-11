'use strict'

// require
const NeDB_Modules = require('../../nedb_module')
let dbmethod = new NeDB_Modules()

// var
let target_cid = "aW2hG7kwoOPfhzkX"
let target_id = "9SOzR0peDyDw9e80"

/*
   dbmethod.delete_clip_id(target_cid, () => {
   console.log('deleted')
   })
   //*/

/*
   let idx = 5
   let col = 7
   let tags = ["test", "updated"]
   let con = "updated content"
   dbmethod.update_tilecon_cidid(con, target_cid, target_id, (doc) => {
   console.log(doc)
   })
   //*/

/*
   dbmethod.update_cliptags_id(["test", "updated"], target_cid, (doc) => {
   console.log(doc)
   })
   //*/

/*
   dbmethod.find_tiles_cidtags(target_cid, ['よくわからなかった'], (clips) => {
   console.log(clips)
   })
   //*/

/*
dbmethod.find_clips_tags(['helloworld'], (clips) => {
   console.log(clips)
   })
   //*/

/*
   dbmethod.find_alltilestags_cid(target_cid, (tags) => {
   console.log(tags)
   })
   //*/

/*
   dbmethod.find_allclipstags((tags) => {
   console.log(tags)
   })
   //*/

/*
// validation error
   let instance = {
   "cid": target_cid,
   "idx": 0,
   "col": 321,
   "tag": ["公式", "よくわかった"],
   "sty": "txt",
   "con": '$y = ax => x = \frac{y}{a}$',
   "hoge": "hoge"
   }

   dbmethod.insert_tile(instance, (newdocs) => {
   console.log(newdocs)
   })
   //*/

/*
   dbmethod.find_tiles_cid(target_cid, (docs) => {
   console.log(docs)
   })
   //*/

/*
   dbmethod.find_clip_id(target_cid, (doc) => {
   console.log(doc)
   })
   //*/

/*
   dbmethod.insert_clip(['helloworld', 'coordinote'], (newdocs) => {
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
   dbmethod.insert_tile(instance, (newdocs) => {
   console.log(newdocs)
   })
   //*/
