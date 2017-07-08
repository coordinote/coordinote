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
let TILE = [];
let clip_id = "null";
let Select_Tile = {};
let WriteClip = WriteClip_1 = class WriteClip {
    constructor(elementRef, Renderer) {
        this.elementRef = elementRef;
        this.Renderer = Renderer;
        this.output = new core_1.EventEmitter();
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
        this.output.emit(tile);
    }
    unvisibleTextarea(tile) {
        if (tile.con.match(/^[ 　\r\n\t]*$/)) {
            TILE.splice(tile.idx, 1);
        }
        else {
            tile.edited = false;
            let input = this.el.querySelector("#textarea" + tile.idx);
            this.el.querySelector("#tile" + tile.idx).style.top = input.offsetTop + "px";
            this.el.querySelector("#tile" + tile.idx).style.left = input.offsetLeft + "px";
        }
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WriteClip.prototype, "tiles", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WriteClip.prototype, "select_tile", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], WriteClip.prototype, "output", void 0);
WriteClip = WriteClip_1 = __decorate([
    core_1.Component({
        selector: 'write-clip',
        templateUrl: 'write/template/write.html',
        directives: WriteClip_1
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Renderer])
], WriteClip);
exports.WriteClip = WriteClip;
let WriteNav = WriteNav_1 = class WriteNav {
};
__decorate([
    core_1.Input(),
    __metadata("design:type", Tile)
], WriteNav.prototype, "tiles", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WriteNav.prototype, "select_tile", void 0);
WriteNav = WriteNav_1 = __decorate([
    core_1.Component({
        selector: 'write-nav',
        template: `
    <nav class="col-sm-12">
      <input type="text" id="tile-tag-input" class="col-sm-9" [(ngModel)]="select_tile.tag">
      <select id="col-select" class="col-sm-3" [(ngModel)]="select_tile.col">
        <option *ngFor="let number of [1,2,3,4,5,6,7,8,9,10,11,12]">{{number}}</option>
      </select>
    </nav>
  `,
        directives: WriteNav_1
    })
], WriteNav);
exports.WriteNav = WriteNav;
let AppComponent = class AppComponent {
    constructor() {
        this.tiles = TILE;
        this.select_tile = Select_Tile;
    }
};
AppComponent = __decorate([
    core_1.Component({
        selector: 'write-view',
        template: `
    <write-nav class="write-nav" [tiles]="tiles" [select_tile]="select_tile"></write-nav>
    <article class="write-field">
      <write-clip [tiles]="tiles" [select_tile]="select_tile" (output)="select_tile=$event"></write-clip>
    </article>
    `,
        directives: [WriteClip, WriteNav],
        inputs: ['tiles', 'select_tile']
    })
], AppComponent);
exports.AppComponent = AppComponent;
var WriteClip_1, WriteNav_1;
//# sourceMappingURL=app.component.js.map