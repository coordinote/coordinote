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
var AppComponent = (function () {
    function AppComponent() {
        this.title = "write";
        this.tiles = TILE;
    }
    AppComponent.prototype.add_Tile = function () {
        TILE.push({
            "index": TILE.length,
            "column": 3,
            "style": "text",
            "content": ''
        });
    };
    AppComponent.prototype.log = function () {
        console.log(TILE);
        ipcRenderer.send('save_tile', TILE);
    };
    AppComponent.prototype.load = function () {
        ipcRenderer.send('load_clip', 'hoge');
    };
    AppComponent.prototype.save_clip = function () {
        ipcRenderer.send('save_clip', ['clip_test', 'test']);
    };
    AppComponent.prototype.newDB = function () {
        ipcRenderer.send('newDB', 'hoge');
    };
    AppComponent.prototype.on = function () { };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'write-view',
        templateUrl: 'write/template/write.html'
    })
], AppComponent);
exports.AppComponent = AppComponent;
(function (event, message) {
    console.log(message);
});
//# sourceMappingURL=app.component.js.map