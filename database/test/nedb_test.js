'use strict'

let NeDB_Modules = require('../nedb_module.js')
let dbmethod = new NeDB_Modules()

//*
dbmethod.get_tiles_cid("aW2hG7kwoOPfhzkX", (docs) => {
  console.log(docs)
})
//*/

/*
dbmethod.set_clip(['helloworld', 'coordinote'], (newdocs) => {
  console.log(newdocs)
})
//*/

/*
let instance = {
  "cid": "aW2hG7kwoOPfhzkX",
  "idx": 0,
  "col": 321,
  "tag": ["公式", "よくわかった"],
  "sty": "txt",
  "con": '$y = ax => x = \frac{y}{a}$'
}
dbmethod.set_tile(instance, (newdocs) => {
  console.log(newdocs)
})
//*/
