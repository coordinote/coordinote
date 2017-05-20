// require
const async = require('async')
const validate = require('jsonschema').validate

// define schema
const clip_schema = {
  "type": "object",
  "required": ["date"],
  "properties": {
    "date": {"type": "date-time"},
    "tile": {"type": "array"},
    "tag": {"type": "array"},
  }
}

function clipSchema(){
}

// valid clip_schema
clipSchema.clip_valid = function(instance, callback_global){
  async.waterfall([
    function(callback){
      let valid = validate(instance, clip_schema).valid
      callback(null, valid)
    },
    function(valid, callback){
      callback_global(valid)
      callback(null)
    }
  ])
}

// exports
module.exports = clipSchema

