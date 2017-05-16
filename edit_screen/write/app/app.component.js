"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
class Tile {
}
exports.Tile = Tile;
const TILE_EG = [
    {
        "id": 2,
        "text": 'This tile number is 2',
        "col_size": 3,
        "row_index": 1
    },
    {
        "id": 1,
        "text": 'This tile number is 1',
        "col_size": 5,
        "row_index": 1
    },
    {
        "id": 3,
        "text": 'This tile number is 3',
        "col_size": 4,
        "row_index": 1
    },
    {
        "id": 4,
        "text": 'This tile number is 4',
        "col_size": 3,
        "row_index": 2
    },
    {
        "id": 5,
        "text": 'This tile number is 5',
        "col_size": 8,
        "row_index": 2
    },
    {
        "id": 6,
        "text": 'This tile number is 6',
        "col_size": 4,
        "row_index": 3
    }
];
let AppComponent = class AppComponent {
    constructor() {
        this.title = 'write';
        this.tile = TILE_EG;
    }
};
AppComponent = __decorate([
    Component({
        selector: 'write-view',
        template: `
    <h1> {{title}}_view </h1>
  `
    })
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map