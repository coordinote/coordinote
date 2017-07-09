'use strict'

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

const idx_schema = {
  "type": "integer",
  "additionalProperties": false
}

const col_schema = {
  "type": "integer",
  "additionalProperties": false
}

const tag_schema = {
  "type": "array"
}

const con_schema = {
  "type": "string",
  "additionalProperties": false
}

// constructor
function tileSchema(){
}

// valid tile_schema
tileSchema.tile_valid = function(instance, callback_arg){
  async.waterfall([
    (callback) => {
      let result = validate(instance, tile_schema)
      callback(null, result)
    },
    (result, callback) => {
      callback_arg(result)
      callback(null)
    }
  ])
}

tileSchema.idx_valid = function(idx, callback_arg){
  async.waterfall([
    (callback) => {
      let result = validate(idx, idx_schema)
      callback(null, result)
    },
    (result, callback) => {
      callback_arg(result)
      callback(null)
    }
  ])
}

tileSchema.col_valid = function(col, callback_arg){
  async.waterfall([
    (callback) => {
      let result = validate(col, col_schema)
      callback(null, result)
    },
    (result, callback) => {
      callback_arg(result)
      callback(null)
    }
  ])
}

tileSchema.tag_valid = function(tag, callback_arg){
  async.waterfall([
    (callback) => {
      let result = validate(tag, tag_schema)
      callback(null, result)
    },
    (result, callback) => {
      callback_arg(result)
      callback(null)
    }
  ])
}

tileSchema.con_valid = function(con, callback_arg){
  async.waterfall([
    (callback) => {
      let result = validate(con, con_schema)
      callback(null, result)
    },
    (result, callback) => {
      callback_arg(result)
      callback(null)
    }
  ])
}

// exports
module.exports = tileSchema

