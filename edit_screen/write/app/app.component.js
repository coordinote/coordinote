"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const nedb_module_js_1 = require("nedb_module.js");
class Tile {
}
exports.Tile = Tile;
var TILE = [];
let AppComponent = class AppComponent {
    constructor() {
        this.title = "write";
        this.tiles = TILE;
    }
    add_Tile() {
        TILE.push({
            "index": 0,
            "text": '',
            "col_size": 3,
            "row_index": 1
        });
    }
    save() {
        nedb_module_js_1.nedb.db.clips.insert({
            "tile": Tile[],
            "tag": "hoge"
        });
    }
};
AppComponent = __decorate([
    core_1.Component({
        selector: 'write-view',
        templateUrl: 'write/template/write.html'
    })
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map