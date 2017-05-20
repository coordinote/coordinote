// require
const nedb = require('nedb')
const clip_schema = require('./clip_schema.js')

// constructor
let DBMethod = function(){
  // db require
  this.db = {}
  this.db.clips = new nedb({filename: '~/coordinote/database/clips.db', autoload: true})
}

DBMethod.prototype.get_clip = function(clip, callback){
  this.db.clips.find({clip: clip}, (err, docs) => {
    callback(docs)
  })
}

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
      this.db.clips.insert(instance)
      callback()
    }
    else{
      // output errors
      console.error(result.errors)
    }
  })
}

// exports
module.exports = DBMethod

