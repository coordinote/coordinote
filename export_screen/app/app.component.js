"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
var CLIP = [];
var TILE = [];
let AppComponent = class AppComponent {
    constructor() {
        this.clips = CLIP;
        this.tiles = TILE;
    }
    append_clip() {
        CLIP.push({
            "con": 'test'
        });
    }
    append_tile() {
        TILE.push({
            "con": 'test'
        });
    }
};
AppComponent = __decorate([
    core_1.Component({
        selector: 'export-view',
        templateUrl: 'template/preview.html'
    })
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map