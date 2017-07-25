'use strict'

// require
const async = require('async')
const validate = require('jsonschema').validate

// define schema
const tile_schema_txt = {
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

const tile_schema_svg = {
  "type": "object",
  "required": ["cid", "idx", "col", "tag", "sty", "con"],
  "additionalProperties": false,
  "properties": {
    "cid": {"type": "string"},
    "idx": {"type": "integer"},
    "col": {"type": "integer"},
    "tag": {"type": "array"},
    "sty": {"type": {"enum": ["txt", "svg", "fig"]}},
    "con": {"type": "array"}
  }
}

const cid_schema = {
  "type": "string",
  "required": true,
  "additionalProperties": false
}

const idx_schema = {
  "type": "integer",
  "required": true,
  "additionalProperties": false
}

const col_schema = {
  "type": "integer",
  "required": true,
  "additionalProperties": false
}

const tag_schema = {
  "type": "array",
  "required": true,
  "additionalProperties": false
}

const con_schema_txt = {
  "type": "string",
  "required": true,
  "additionalProperties": false
}

const con_schema_svg = {
  "type": "array",
  "required": true,
  "additionalProperties": false
}

// constructor
function tileSchema(){
}

// valid tile_schema
tileSchema.tile_valid = function(instance, callback_arg){
  async.waterfall([
    (callback) => {
      let result
      switch(instance.sty){
        case "txt":
          result = validate(instance, tile_schema_txt)
          callback(null, result)
          break
        case "svg":
          result = validate(instance, tile_schema_svg)
          callback(null, result)
          break
        default:
          result = validate(instance, tile_schema_txt)
          callback(null, result)
      }
    },
    (result, callback) => {
      callback_arg(result)
      callback(null)
    }
  ])
}

tileSchema.cid_valid = function(cid, callback_arg){
  async.waterfall([
    (callback) => {
      let result = validate(cid, cid_schema)
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

tileSchema.con_valid = function(con, sty, callback_arg){
  async.waterfall([
    (callback) => {
      let result
      switch(sty){
        case "txt":
          result = validate(con, con_schema_txt)
          callback(null, result)
          break
        case "svg":
          result = validate(con, con_schema_svg)
          callback(null, result)
          break
        default:
          result = validate(con, con_schema_txt)
          callback(null, result)
      }
    },
    (result, callback) => {
      callback_arg(result)
      callback(null)
    }
  ])
}

// exports
module.exports = tileSchema

