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
const TILE_EG = [
    {
        "index": 2,
        "text": 'This tile number is 2',
        "col_size": 3,
        "row_index": 1
    },
    {
        "index": 1,
        "text": 'This tile number is 1',
        "col_size": 5,
        "row_index": 1
    },
    {
        "index": 3,
        "text": 'This tile number is 3',
        "col_size": 4,
        "row_index": 1
    },
    {
        "index": 4,
        "text": 'This tile number is 4',
        "col_size": 3,
        "row_index": 2
    },
    {
        "index": 5,
        "text": 'This tile number is 5',
        "col_size": 8,
        "row_index": 2
    },
    {
        "index": 6,
        "text": 'This tile number is 6',
        "col_size": 4,
        "row_index": 3
    }
];
let AppComponent = class AppComponent {
    constructor() {
        this.title = 'write';
        this.tiles = TILE_EG;
    }
};
AppComponent = __decorate([
    core_1.Component({
        selector: 'write-view',
        template: `
    <h1 class="col-sm-12">{{title}}</h1>
    <span *ngFor="let tile of tiles">
    <div class="col-sm-{{tile.col_size}} hoge">
      {{tile.text}}
    </div>
    </span>
  `
    })
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map