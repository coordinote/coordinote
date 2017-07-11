'use strict'

// require
const nedb = require('nedb')
const os = require('os')
const async = require('async')
const clip_schema = require('./clip_schema.js')
const tile_schema = require('./tile_schema.js')

// const
const DB_DIR = os.homedir() + '/coordinote/database/'

// constructor
let DBMethod = function(){
  // db require
  this.db = {}
  // /path/to/homedir/coordinote/database
  this.db.clips = new nedb({filename: DB_DIR + 'clips.db', autoload: true})
}

// loader
/* load tile database instance by cid */
DBMethod.prototype.dbLoad = function(cid, callback){
  this.db.clips.findOne({_id: cid}, (err, doc) => {
    if(err){
      console.error(err)
    }
    else{
      if(this.db[doc.tile_file] === undefined){
        this.db[doc.tile_file] = new nedb({filename: DB_DIR + doc.tile_file + '.db', autoload: true})
      }
      callback(doc.tile_file)
    }
  })
}

// find
/* find clip by _id */
DBMethod.prototype.find_clip_id = function(id, callback){
  this.db.clips.findOne({_id: id}, (err, doc) => {
    if(this.db[doc.tile_file] === undefined){
      this.db[doc.tile_file] = new nedb({filename: DB_DIR + doc.tile_file + '.db', autoload: true})
    }
    this.db[doc.tile_file].find({cid: doc._id}, (err, tiledocs) => {
      doc.tile = tiledocs
      callback(doc)
    })
  })
}

/* find all type of tag in clips */
DBMethod.prototype.find_allclipstags = function(callback_arg){
  async.waterfall([
    (callback) => {
      // projection by tag elem
      this.db.clips.find({}, {tag: 1}, (err, docs) => {
        let tagConcat = []
        async.eachSeries(docs, (doc, callback) => {
          tagConcat = tagConcat.concat(doc.tag)
          callback()
        },
        (err) => {
          callback(null, tagConcat)
        })
      })
    },
    (tagConcat, callback) => {
      // remove duplication
      let tagSet = new Set(tagConcat)
      callback(null, tagSet)
    },
    (tagSet, callback) => {
      callback_arg(Array.from(tagSet.values()))
      callback(null)
    }
  ])
}

/* find clips by selected tags(about clip) */
DBMethod.prototype.find_clips_tags = function(clip_tags, callback_arg){
  async.waterfall([
    (callback) => {
      // convert to query from clips_tags
      let clip_tags_edited = []
      async.each(clip_tags, (clip_tag, callback) => {
        clip_tags_edited.push({tag: clip_tag})
        callback()
      },(err) => {
        callback(null, clip_tags_edited)
      })
    },
    (clip_tags, callback) => {
      this.db.clips.find({$and: clip_tags}, (err, clipdocs) => {
        let clipdocs_edited = []
        async.each(clipdocs, (doc, callback) => {
          this.find_tiles_cid(doc._id, (tiledocs) => {
            clipdocs_edited.push(Object.assign(doc, {tile: tiledocs}))
            callback()
          })
        },
        (err) => {
          callback_arg(clipdocs_edited)
        })
      })
    }
  ])
}

/* find tiles by cid */
DBMethod.prototype.find_tiles_cid = function(clip_id, callback){
  this.dbLoad(clip_id, (tile_file) => {
    this.db[tile_file].find({cid: clip_id}, (err, tiledocs) => {
      if(err){
        console.error(err)
      }
      callback(tiledocs)
    })
  })
}

/* find all type of tag in tiles by cid */
DBMethod.prototype.find_alltilestags_cid = function(clip_id, callback_arg){
  async.waterfall([
    (callback) => {
      this.dbLoad(clip_id, (tile_file) => {
        // projection by tag elem
        this.db[tile_file].find({cid: clip_id}, {tag: 1}, (err, tiledocs) => {
          let tagConcat = []
          async.eachSeries(tiledocs, (doc, callback) => {
            tagConcat = tagConcat.concat(doc.tag)
            callback()
          },
          (err) => {
            callback(null, tagConcat)
          })
        })
      })
    },
    (tagConcat, callback) => {
      // remove duplication
      let tagSet = new Set(tagConcat)
      callback(null, tagSet)
    },
    (tagSet, callback) => {
      callback_arg(Array.from(tagSet.values()))
      callback(null)
    }
  ])
}

/* find tiles from selected tags(about tile) */
DBMethod.prototype.find_tiles_cidtags = function(clip_id, tile_tags, callback_arg){
  async.waterfall([
    (callback) => {
      // convert to query from tile_tags
      let tile_tags_edited = []
      async.each(tile_tags, (tile_tag, callback) => {
        tile_tags_edited.push({tag: tile_tag})
        callback()
      },
      (err) => {
        callback(null, tile_tags_edited)
      })
    },
    (tile_tags, callback) => {
      // clip load and fetch tile_file
      this.dbLoad(clip_id, (tile_file) => {
        callback(null, tile_tags, tile_file)
      })
    },
    (tile_tags, tile_file, callback) => {
      // search tags and cid
      this.db[tile_file].find({$and: tile_tags.concat({cid: clip_id})}, (err, docs) => {
        callback_arg(docs)
      })
      callback(null)
    }
  ])
}


// insert
/* insert clip by tag */
DBMethod.prototype.insert_clip = function(tag, callback_arg){
  async.waterfall([
    (callback) => {
      // document instance
      let instance = {
        "date": new Date(),
        "tile_file": "",
        "tag": tag
      }

      if(instance.date.getMonth() + 1 < 10){
        instance.tile_file = instance.date.getFullYear().toString() + '0' + (instance.date.getMonth() + 1).toString()
      }
      else{
        instance.tile_file = instance.date.getFullYear().toString() + (instance.date.getMonth() + 1).toString()
      }
      callback(null, instance)
    },
    (instance, callback) => {
      // create db instance
      if(this.db[instance.tile_file] === undefined){
        this.db[instance.tile_file] = new nedb({filename: DB_DIR + instance.tile_file + '.db', autoload: true})
      }
      callback(null, instance)
    },
    (instance, callback) => {
      clip_schema.clip_valid(instance, (result) => {
        if(result.valid){
          // insert data
          this.db.clips.insert(instance, (err, newdocs) =>{
            callback_arg(newdocs)
          })
        }
        else{
          // output errors
          console.error(result.errors)
        }
      })
      callback(null)
    }
  ])
}

/* insert clip by document(shemed) */
DBMethod.prototype.insert_tile = function(instance, callback){
  tile_schema.tile_valid(instance, (result) => {
    if(result.valid){
      // insert data(for {clip.tile_file}.db)
      this.dbLoad(instance.cid, (tile_file) => {
        this.db[tile_file].insert(instance, (err, newdocs) => {
          callback(newdocs)
        })
      })
    }
    else{
      // output errors
      console.error(result.errors)
    }
  })
}

// update
/* update tag about clip by _id */
DBMethod.prototype.update_cliptags_id = function(tags, clip_id, callback){
  clip_schema.tag_valid(tags, (result) => {
    if(result.valid){
      this.db.clips.update({_id: clip_id}, {$set: {tag: tags}}, {returnUpdatedDocs: true}, (err, numReplaced, affectedDocuments) => {
        callback(affectedDocuments)
      })
    }
    else{
      // output errors
      console.error(result.errors)
    }
  })
}

/* update idx about tile by cid and _id */
DBMethod.prototype.update_tileidx_cidid = function(idx, clip_id, tile_id, callback){
  tile_schema.idx_valid(idx, (result) => {
    if(result.valid){
      this.dbLoad(clip_id, (tile_file) => {
        this.db[tile_file].update({_id: tile_id}, {$set: {idx: idx}}, {returnUpdatedDocs: true}, (err, numReplaced, affectedDocuments) => {
          callback(affectedDocuments)
        })
      })
    }
    else{
      // output
      console.error(result.errors)
    }
  })
}

/* update col about tile by cid and _id */
DBMethod.prototype.update_tilecol_cidid = function(col, clip_id, tile_id, callback){
  tile_schema.col_valid(col, (result) => {
    if(result.valid){
      this.dbLoad(clip_id, (tile_file) => {
        this.db[tile_file].update({_id: tile_id}, {$set: {col: col}}, {returnUpdatedDocs: true}, (err, numReplaced, affectedDocuments) => {
          callback(affectedDocuments)
        })
      })
    }
    else{
      // output
      console.error(result.errors)
    }
  })
}

/* update tag about tile by cid and _id */
DBMethod.prototype.update_tiletags_cidid = function(tags, clip_id, tile_id, callback){
  tile_schema.tag_valid(tags, (result) => {
    if(result.valid){
      this.dbLoad(clip_id, (tile_file) => {
        this.db[tile_file].update({_id: tile_id}, {$set: {tag: tags}}, {returnUpdatedDocs: true}, (err, numReplaced, affectedDocuments) => {
          callback(affectedDocuments)
        })
      })
    }
    else{
      // output
      console.error(result.errors)
    }
  })
}

/* update con about tile by cid and _id */
DBMethod.prototype.update_tilecon_cidid = function(con, clip_id, tile_id, callback){
  tile_schema.con_valid(con, (result) => {
    if(result.valid){
      this.dbLoad(clip_id, (tile_file) => {
        this.db[tile_file].update({_id: tile_id}, {$set: {con: con}}, {returnUpdatedDocs: true}, (err, numReplaced, affectedDocuments) => {
          callback(affectedDocuments)
        })
      })
    }
    else{
      // output
      console.error(result.errors)
    }
  })
}

// delete
/* delete clip by _id */
DBMethod.prototype.delete_clip_id = function(clip_id, callback){
  // delete clip and tiles
  this.dbLoad(clip_id, (tile_file) => {
    this.db[tile_file].remove({cid: clip_id}, {multi: true}, (numRemoved) => {
      this.db.clips.remove({_id: clip_id}, {}, () => {
        callback()
      })
    })
  })
}

/* delete tile by cid and _id */
DBMethod.prototype.delete_tile_cidid = function(clip_id, tile_id, callback){
  this.dbLoad(clip_id, (tile_file) => {
    this.db[tile_file].remove({_id: tile_id}, {}, (numRemoved) => {
      callback()
    })
  })
}

// exports
module.exports = DBMethod

