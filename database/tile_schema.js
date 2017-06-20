// require
const async = require('async')
const validate = require('jsonschema').validate

// define schema
const tile_schema = {
  "type": "object",
  "required": ["cid", "idx", "col", "tag", "sty", "con"],
  "additionalProperties": false,
  "properties": {
    "cid": {"type": "string"},
    "idx": {"type": "integer"},
    "col": {"type": "integer"},
    "tag": {"type": "array"},
    "sty": {"type": {"enum": ["txt", "svg", "fig"]}},
    "con": {"type": "string"}
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

