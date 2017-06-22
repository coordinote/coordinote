// require
const async = require('async')
const validate = require('jsonschema').validate

// define schema
const clip_schema = {
  "type": "object",
  "required": ["date", "tile_file", "tag"],
  "additionalProperties": false,
  "properties": {
    "date": {"type": "date-time"},
    "tile_file": {"type": "string"},
    "tag": {"type": "array"}
  }
}

// constructor
function clipSchema(){
}

// valid clip_schema
clipSchema.clip_valid = function(instance, callback_global){
  async.waterfall([
    (callback) => {
      let result = validate(instance, clip_schema)
      callback(null, result)
    },
    (result, callback) => {
      callback_global(result)
      callback(null)
    }
  ])
}

// exports
module.exports = clipSchema

