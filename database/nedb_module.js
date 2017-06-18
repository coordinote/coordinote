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

// getter
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


// setter
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

// exports
module.exports = DBMethod

