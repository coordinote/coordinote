"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
class Tile {
}
exports.Tile = Tile;
var TILE = [];
var clip_id = "null";
let AppComponent = class AppComponent {
    constructor(elementRef, Renderer) {
        this.elementRef = elementRef;
        this.Renderer = Renderer;
        this.title = "write";
        this.tiles = TILE;
        this.el = this.elementRef.nativeElement;
        this.renderer = this.Renderer;
    }
    add_tile() {
        TILE.push({
            cid: clip_id,
            idx: TILE.length,
            col: 3,
            tag: ["test", "やったあ"],
            sty: "txt",
            con: '',
            edited: true
        });
    }
    save_tile() {
        for (let i = 0; i < TILE.length; i++) {
            delete TILE[i].edited;
            console.log(TILE[i]);
        }
        if (clip_id === "null") {
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
    resize(textarea) {
        let scrollHeight = this.el.querySelector("#" + textarea.id).scrollHeight;
        let height = this.el.querySelector("#" + textarea.id).offsetHeight;
        let lineHeight = this.el.querySelector("#" + textarea.id).style.lineHeight;
        lineHeight = parseInt(lineHeight.replace(/px/g, ""));
        if (scrollHeight > height) {
            this.el.querySelector("#" + textarea.id).style.height = scrollHeight + "px";
        }
        else if (scrollHeight < height) {
            this.el.querySelector("#" + textarea.id).style.height = height - lineHeight + "px";
        }
    }
    visibleTextarea(tile) {
        tile.edited = true;
        this.el.querySelector("#textarea" + tile.idx).style.visibility = "visible";
        this.renderer.invokeElementMethod(this.el.querySelector("#textarea" + tile.idx), 'focus');
    }
    unvisibleTextarea(tile) {
        tile.edited = false;
        this.el.querySelector("#textarea" + tile.idx).style.visibility = "hidden";
        let input = this.el.querySelector("#textarea" + tile.idx);
        this.el.querySelector("#tile" + tile.idx).style.top = input.offsetTop + "px";
        this.el.querySelector("#tile" + tile.idx).style.left = input.offsetLeft + "px";
    }
};
AppComponent = __decorate([
    core_1.Component({
        selector: 'write-view',
        templateUrl: 'write/template/write.html'
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Renderer])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map