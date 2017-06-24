"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
class Tile {
}
exports.Tile = Tile;
var TILE = [];
var clip_id = null;
let AppComponent = class AppComponent {
    constructor() {
        this.title = "write";
        this.tiles = TILE;
    }
    add_tile() {
        TILE.push({
            "cid": clip_id,
            "idx": TILE.length,
            "col": 3,
            "tag": ["test", "やったあ"],
            "sty": "txt",
            "con": ''
        });
    }
    save_tile() {
        if (clip_id === null) {
            clip_id = ipcRenderer.sendSync('save_clip', ['clip_test', 'test']);
            for (let i = 0; i < TILE.length; i++) {
                TILE[i].cid = clip_id;
            }
            ipcRenderer.send('save_tile', TILE);
        }
    }
    load_clip() {
        console.log(ipcRenderer.sendSync('load_clip', clip_id));
    }
    save_clip() {
        clip_id = ipcRenderer.sendSync('save_clip', ['clip_test', 'test']);
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