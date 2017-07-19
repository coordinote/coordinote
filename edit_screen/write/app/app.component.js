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
const http_1 = require("@angular/http");
const socket = io.connect('http://localhost:6277');
class Tile {
}
exports.Tile = Tile;
let TILE = [];
let clip_id = "null";
let Select_Tile = {};
let preTile = {};
socket.on('res_cid', (cid) => {
    clip_id = cid;
});
let MathJaxDirective = class MathJaxDirective {
    constructor(el) {
        this.el = el;
    }
    ngOnChanges() {
        this.el.nativeElement.innerHTML = this.texExpression;
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.el.nativeElement]);
    }
};
__decorate([
    core_1.Input('MathJax'),
    __metadata("design:type", String)
], MathJaxDirective.prototype, "texExpression", void 0);
MathJaxDirective = __decorate([
    core_1.Directive({
        selector: '[MathJax]'
    }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], MathJaxDirective);
exports.MathJaxDirective = MathJaxDirective;
let WriteClip = WriteClip_1 = class WriteClip {
    constructor(elementRef, Renderer) {
        this.elementRef = elementRef;
        this.Renderer = Renderer;
        this.output = new core_1.EventEmitter();
        this.save_tileedit = new core_1.EventEmitter();
        this.getPreTileedit = new core_1.EventEmitter();
        this.el = this.elementRef.nativeElement;
        this.renderer = this.Renderer;
    }
    add_tile() {
        tilesort(() => {
            TILE.push({
                idx: TILE.length,
                col: 3,
                tag: [],
                sty: "txt",
                con: '',
                edited: false,
                saved: false,
                _id: null
            });
        });
    }
    save_tile(tile) {
        this.save_tileedit.emit(tile);
    }
    /*
      load_clip(): void{
        console.log(ipcRenderer.sendSync('load_clip', clip_id));
      }
    */
    save_clip() {
        socket.emit('save_clip', ['clip_test', 'test']);
    }
    add_canvas() {
        TILE.push({
            cid: clip_id,
            idx: TILE.length,
            col: 3,
            tag: [],
            sty: "svg",
            con: '',
        });
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
    visibleTextarea(tile, dom) {
        // case of text
        if (tile.sty === "txt") {
            let div = this.el.querySelector("#tile" + tile.idx);
            tile.edited = true;
            this.el.querySelector("#textarea" + tile.idx).style.visibility = "visible";
            this.renderer.invokeElementMethod(this.el.querySelector("#textarea" + tile.idx), 'focus');
            this.output.emit(tile);
            this.el.querySelector("#textarea" + tile.idx).style.top = div.offsetTop + "px";
            this.el.querySelector("#textarea" + tile.idx).style.left = div.offsetLeft + "px";
        }
        else if (tile.sty === "svg") {
            dom.contentWindow.sendReadID();
            this.output.emit(tile);
        }
    }
    unvisibleTextarea(tile) {
        if (tile.con.match(/^[ 　\r\n\t]*$/)) {
            TILE.splice(tile.idx, 1);
        }
        else {
            tile.edited = false;
        }
    }
    getPreTile(tile) {
        this.getPreTileedit.emit(tile);
    }
    test() {
        console.log(TILE);
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", Tile)
], WriteClip.prototype, "tiles", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WriteClip.prototype, "select_tile", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], WriteClip.prototype, "output", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], WriteClip.prototype, "save_tileedit", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], WriteClip.prototype, "getPreTileedit", void 0);
WriteClip = WriteClip_1 = __decorate([
    core_1.Component({
        selector: 'write-clip',
        templateUrl: 'write/template/write.html',
        directives: WriteClip_1,
        styleUrls: ['write/template/canvas_iframe.css']
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Renderer])
], WriteClip);
exports.WriteClip = WriteClip;
let WriteNav = WriteNav_1 = class WriteNav {
    constructor() {
        this.getPreTilenav = new core_1.EventEmitter();
        this.save_tilenav = new core_1.EventEmitter();
    }
    getPreTile(tile) {
        this.getPreTilenav.emit(tile);
    }
    save_tile(tile) {
        this.save_tilenav.emit(tile);
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", Tile)
], WriteNav.prototype, "tiles", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WriteNav.prototype, "select_tile", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], WriteNav.prototype, "getPreTilenav", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], WriteNav.prototype, "save_tilenav", void 0);
WriteNav = WriteNav_1 = __decorate([
    core_1.Component({
        selector: 'write-nav',
        template: `
    <nav class="col-sm-12">
      <tag-input class="tag-input" [(ngModel)]="select_tile.tag" [theme]="'bootstrap'" (click)="getPreTile(select_tile)" (onBlur)="save_tile(select_tile)"></tag-input>
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
    constructor(http) {
        this.http = http;
        this.tiles = TILE;
        this.select_tile = Select_Tile;
    }
    save_tile(tile) {
        if (!tile.con.match(/^[ 　\r\n\t]*$/)) {
            //tileの新規保存
            if (!tile.saved) {
                let tag = tagsubstitute(tile.tag);
                this.http.post('http://localhost:6277/api/save_tile', {
                    cid: clip_id,
                    idx: tile.idx,
                    col: tile.col,
                    tag: tag,
                    sty: tile.sty,
                    con: tile.con
                })
                    .subscribe(res => {
                    tile.tid = res._body;
                });
                tile.saved = true;
            }
            else {
                //tileの更新処理
                let diffkey = tilediff(tile, preTile);
                diffkey.forEach((key) => {
                    switch (key) {
                        case "idx":
                            console.log("idx");
                            socket.emit('update_tileidx', {
                                idx: tile[diffkey],
                                cid: clip_id,
                                _id: tile.tid
                            });
                            break;
                        case "tag":
                            console.log("tag");
                            let tag = tagsubstitute(tile.tag);
                            socket.emit('update_tiletag', {
                                tag: tag,
                                cid: clip_id,
                                _id: tile.tid
                            });
                            break;
                        case "con":
                            console.log("con");
                            socket.emit('update_tilecon', {
                                con: tile[diffkey],
                                cid: clip_id,
                                _id: tile.tid
                            });
                            break;
                        case "col":
                            console.log("col");
                            socket.emit('update_tilecol', {
                                col: tile[diffkey],
                                cid: clip_id,
                                _id: tile.tid
                            });
                            break;
                        default:
                            break;
                    }
                });
            }
        }
        else {
            //データベースのtile削除処理
        }
    }
    getPreTile(tile) {
        preTile = {
            idx: tile.idx,
            col: tile.col,
            tag: tile.tag,
            sty: tile.sty,
            con: tile.con,
            tid: tile.tid
        };
    }
};
AppComponent = __decorate([
    core_1.Component({
        selector: 'write-view',
        template: `
    <write-nav class="write-nav" [tiles]="tiles" [select_tile]="select_tile" (save_tilenav)="save_tile($event)" (getPreTilenav)="getPreTile($event)"></write-nav>
    <article class="write-field">
      <write-clip [tiles]="tiles" [select_tile]="select_tile" (output)="select_tile=$event" (save_tileedit)="save_tile($event)" (getPreTileedit)="getPreTile($event)"></write-clip>
    </article>
    `,
        directives: [WriteClip, WriteNav],
        inputs: ['tiles', 'select_tile']
    }),
    __metadata("design:paramtypes", [http_1.Http])
], AppComponent);
exports.AppComponent = AppComponent;
let tilediff = (tile, preTile) => {
    let keys = Object.keys(tile);
    let diffProp = [];
    keys.forEach((key) => {
        if (tile[key] !== preTile[key]) {
            diffProp.push(key);
        }
    });
    return diffProp;
};
let tilesort = (callback) => {
    TILE.sort((tile1, tile2) => {
        return tile1.idx - tile2.idx;
    });
    for (let i = 0; i < TILE.length; i++) {
        TILE[i].idx = i;
    }
    callback();
};
let tagsubstitute = (tag) => {
    let tag_array = [];
    tag.forEach((input_tag) => {
        tag_array.push(input_tag.value);
    });
    return tag_array;
};
var WriteClip_1, WriteNav_1;
//# sourceMappingURL=app.component.js.map