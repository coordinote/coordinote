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
      let result = validate(instance, clip_schema)
      callback(null, result)
    },
    function(result, callback){
      callback_global(result)
      callback(null)
    }
  ])
}

// exports
module.exports = clipSchema

