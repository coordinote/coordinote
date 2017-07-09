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
DBMethod.prototype.dbLoad = function(cid, callback){
  this.db.clips.findOne({_id: cid}, (err, doc) => {
    if(this.db[doc.tile_file] === undefined){
      this.db[doc.tile_file] = new nedb({filename: DB_DIR + doc.tile_file + '.db', autoload: true})
      callback(doc.tile_file)
    }
  })
}

// get
DBMethod.prototype.get_clip_id = function(id, callback){
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

DBMethod.prototype.get_allclipstags = function(callback_arg){
  async.waterfall([
    (callback) => {
      // projection by tag elem
      this.db.clips.find({}, {tag: 1}, (err, docs) => {
        let tagConcat = []
        for(let doc of docs){
          tagConcat = tagConcat.concat(doc.tag)
        }
        callback(null, tagConcat)
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

DBMethod.prototype.get_clips_tags = function(clip_tags, callback_arg){
  async.waterfall([
    (callback) => {
      for(let i = 0; i < clip_tags.length; i++){
        clip_tags[i] = {tag: clip_tags[i]}
      }
      callback(null, clip_tags)
    },
    (clip_tags, callback) => {
      this.db.clips.find({$and: clip_tags}, (err, docs) => {
        callback_arg(docs)
      })
      callback(null)
    }
  ])
}

DBMethod.prototype.get_tiles_cid = function(clip_id, callback){
  this.db.clips.findOne({_id: clip_id}, (err, doc) => {
    if(this.db[doc.tile_file] === undefined){
      this.db[doc.tile_file] = new nedb({filename: DB_DIR + doc.tile_file + '.db', autoload: true})
    }
    this.db[doc.tile_file].find({cid: doc._id}, (err, tiledocs) => {
      callback(tiledocs)
    })
  })
}

DBMethod.prototype.get_alltilestags_cid = function(clip_id, callback_arg){
  async.waterfall([
    (callback) => {
      this.db.clips.findOne({_id: clip_id}, (err, doc) => {
        if(this.db[doc.tile_file] === undefined){
          this.db[doc.tile_file] = new nedb({filename: DB_DIR + doc.tile_file + '.db', autoload: true})
        }
        // projection by tag elem
        this.db[doc.tile_file].find({cid: doc._id}, {tag: 1}, (err, tiledocs) => {
          let tagConcat = []
          for(let doc of tiledocs){
            tagConcat = tagConcat.concat(doc.tag)
          }
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

DBMethod.prototype.get_tiles_cidtags = function(clip_id, tile_tags, callback_arg){
  async.waterfall([
    (callback) => {
      for(let i = 0; i < tile_tags.length; i++){
        tile_tags[i] = {tag: tile_tags[i]}
      }
      callback(null, tile_tags)
    },
    (tile_tags, callback) => {
      this.db.clips.findOne({_id: clip_id}, (err, doc) => {
        if(this.db[doc.tile_file] === undefined){
          this.db[doc.tile_file] = new nedb({filename: DB_DIR + doc.tile_file + '.db', autoload: true})
        }
        callback(null, tile_tags, doc.tile_file)
      })
    },
    (tile_tags, tile_file, callback) => {
      this.db[tile_file].find({$and: tile_tags}, (err, docs) => {
        callback_arg(docs)
      })
      callback(null)
    }
  ])
}


// set
DBMethod.prototype.set_clip = function(tag, callback_arg){
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

DBMethod.prototype.set_tile = function(instance, callback){
  tile_schema.tile_valid(instance, (result) => {
    if(result.valid){
      // insert data(for {clip.tile_file}.db)
      this.db.clips.findOne({_id: instance.cid}, (err, doc) => {
        if(this.db[doc.tile_file] === undefined){
          this.db[doc.tile_file] = new nedb({filename: DB_DIR + doc.tile_file + '.db', autoload: true})
        }
        this.db[doc.tile_file].insert(instance, (err, newdocs) => {
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
DBMethod.prototype.delete_clip_id = function(clip_id, callback){
  // delete clip and tiles
  this.dbLoad(clip_id, (tile_file) => {
    this.db[tile_file].remove({cid: clip_id}, {multi: true}, (numRemoved) => {
      console.log(numRemoved)
      this.db.clips.remove({_id: clip_id}, {}, () => {
        callback()
      })
    })
  })
}

DBMethod.prototype.delete_tile_cidid = function(clip_id, tile_id, callback){
  this.dbLoad(clip_id, (tile_file) => {
    this.db[tile_file].remove({_id: tile_id}, {}, (numRemoved) => {
      console.log(numRemoved)
      callback()
    })
  })
}

// exports
module.exports = DBMethod

