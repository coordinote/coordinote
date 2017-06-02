// require
const nedb = require('nedb')
const os = require('os')
const clip_schema = require('./clip_schema.js')
const tile_schema = require('./tile_schema.js')

// constructor
let DBMethod = function(){
  // db require
  this.db = {}
  // /path/to/homedir/coordinote/database
  this.db.clips = new nedb({filename: os.homedir() + '/coordinote/database/clips.db', autoload: true})
}

// getter
DBMethod.prototype.get_clip_id = function(id, callback){
  this.db.clips.find({_id: id}, (err, docs) => {
    callback(docs[0])
  })
}

DBMethod.prototype.get_tile = function(clip_id, callback){
  this.db.clips.find({_id: clip_id}, (err, docs) => {
    callback(docs[0].tile)
  })
}

// setter
DBMethod.prototype.set_clip = function(tag, callback){
  // document instance
  let instance = {
    "date": new Date(),
    "tile": [],
    "tag": tag
  }

  clip_schema.clip_valid(instance, (result) => {
    if(result.valid){
      // insert data
      this.db.clips.insert(instance, (err, newdocs) =>{
        callback(newdocs)
      })
    }
    else{
      // output errors
      console.error(result.errors)
    }
  })
}

DBMethod.prototype.set_tile = function(instance, clip_id, callback){
  tile_schema.tile_valid(instance, (result) => {
    if(result.valid){
      // insert data(update subdoc)
      this.db.clips.update({_id: clip_id}, {$push: {tile: instance}}, {}, (err, newdocs) => {
        callback(newdocs)
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

