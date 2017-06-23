"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Tile = (function () {
    function Tile() {
    }
    return Tile;
}());
exports.Tile = Tile;
var TILE = [];
var clip_id = null;
var AppComponent = (function () {
    function AppComponent() {
        this.title = "write";
        this.tiles = TILE;
    }
    AppComponent.prototype.add_tile = function () {
        TILE.push({
            "cid": clip_id,
            "idx": TILE.length,
            "col": 3,
            "tag": ["test", "やったあ"],
            "sty": "txt",
            "con": ''
        });
    };
    AppComponent.prototype.save_tile = function () {
        console.log(TILE);
        if (clip_id !== null) {
            ipcRenderer.send('save_tile', TILE);
        }
    };
    AppComponent.prototype.load_clip = function () {
        console.log(ipcRenderer.sendSync('load_clip', clip_id));
    };
    AppComponent.prototype.save_clip = function () {
        clip_id = ipcRenderer.sendSync('save_clip', ['clip_test', 'test']);
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'write-view',
        templateUrl: 'write/template/write.html'
    })
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map