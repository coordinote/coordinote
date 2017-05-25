// require
const async = require('async')
const validate = require('jsonschema').validate

// define schema
const tile_schema = {
  "type": "object",
  "required": [],
  "properties": {
    "index": {"type": "integer"},
    "column": {"type": "integer"},
    "style": {"type": {"enum": ["text", "canvas", "figure"]}},
    "content": {"type": "string"}
  }
}

// constructor
function tileSchema(){
}

// valid tile_schema
tileSchema.tile_valid = function(instance, callback_global){
  async.waterfall([
    (callback) => {
      let result = validate(instance, tile_schema)
      callback(null, result)
    },
    (result, callback) => {
      callback_global(result)
      callback(null)
    }
  ])
}

// exports
module.exports = tileSchema

