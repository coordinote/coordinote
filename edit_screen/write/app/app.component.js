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
const platform_browser_1 = require("@angular/platform-browser");
const moment = require("moment");
const http_1 = require("@angular/http");
const socket = io.connect('http://localhost:6277');
class Tile {
}
exports.Tile = Tile;
const undefinedtag = ['undefined'];
const saveTileURL = 'http://localhost:6277/api/save_tile';
let TILE = [];
let clip_id = null;
let CLIP = [];
let Clip_Tag = [];
let Select_Tile = {};
let preTile = {};
let FindTag = [];
let DATE = {
    start: moment(),
    end: moment()
};
socket.on('res_cid', (cid) => {
    clip_id = cid;
});
socket.on('res_clips', (clips) => {
    initClip(() => {
        Array.prototype.push.apply(CLIP, clips);
    });
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
let SafePipe = class SafePipe {
    constructor(sanitizer) {
        this.sanitizer = sanitizer;
    }
    transform(url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
};
SafePipe = __decorate([
    core_1.Pipe({ name: 'safe' }),
    __metadata("design:paramtypes", [platform_browser_1.DomSanitizer])
], SafePipe);
exports.SafePipe = SafePipe;
let WriteClip = WriteClip_1 = class WriteClip {
    constructor(elementRef, Renderer, http) {
        this.elementRef = elementRef;
        this.Renderer = Renderer;
        this.http = http;
        this.output = new core_1.EventEmitter();
        this.save_tileedit = new core_1.EventEmitter();
        this.getPreTileedit = new core_1.EventEmitter();
        this.CanvasURL = "http://localhost:6277/html/read/";
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
    add_canvas() {
        tilesort(() => {
            TILE.push({
                idx: TILE.length,
                col: 3,
                tag: [],
                sty: "svg",
                con: '',
                saved: false,
                _id: null
            });
        });
    }
    save_tile(tile) {
        this.save_tileedit.emit(tile);
    }
    save_svg(tile, dom) {
        if (!tile.saved) {
            let tag = tagsubstitute(tile.tag);
            this.http.post(saveTileURL, {
                cid: clip_id,
                idx: tile.idx,
                col: tile.col,
                tag: tag,
                sty: tile.sty,
                con: []
            })
                .subscribe(res => {
                tile._id = res._body;
                dom.contentWindow.save_cidtid(clip_id, tile._id);
                dom.contentWindow.sendReadID();
            });
            tile.saved = true;
        }
    }
    delete_tile(tile) {
        TILE.splice(tile.idx, 1);
        tilesort(() => { });
        //データベースのtile削除処理
        socket.emit('delete_tile', {
            cid: clip_id,
            tid: tile._id
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
            if (tile.saved) {
                dom.contentWindow.sendReadID();
            }
            this.output.emit(tile);
        }
    }
    unvisibleTextarea(tile) {
        tile.edited = false;
    }
    getPreTile(tile) {
        this.getPreTileedit.emit(tile);
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
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Renderer, http_1.Http])
], WriteClip);
exports.WriteClip = WriteClip;
let WriteNav = WriteNav_1 = class WriteNav {
    constructor() {
        this.getPreTilenav = new core_1.EventEmitter();
        this.save_tilenav = new core_1.EventEmitter();
        this.delete_clipedit = new core_1.EventEmitter();
        this.clip_tag = Clip_Tag;
    }
    update_cliptag(clip_tag) {
        if (clip_tag.length > 0) {
            clip_tag = tagsubstitute(clip_tag);
            Clip_Tag = clip_tag;
            socket.emit('update_cliptag', {
                clip_tags: clip_tag,
                cid: clip_id
            });
        }
        else {
            socket.emit('update_cliptag', {
                clip_tags: undefinedtag,
                cid: clip_id
            });
        }
    }
    getPreTile(tile) {
        this.getPreTilenav.emit(tile);
    }
    save_tile(tile) {
        this.save_tilenav.emit(tile);
    }
    delete_tile(tile) {
        TILE.splice(tile.idx, 1);
        tilesort(() => { });
        socket.emit('delete_tile', {
            cid: clip_id,
            tid: tile._id
        });
    }
    delete_clip() {
        this.delete_clipedit.emit();
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
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], WriteNav.prototype, "delete_clipedit", void 0);
WriteNav = WriteNav_1 = __decorate([
    core_1.Component({
        selector: 'write-nav',
        template: `
    <nav>
      <ul>
        <li class="row">
          <button class="col-sm-6 col-xs-6 delete-button" (ngModel)="select_tile" (click)="delete_clip(select_tile)">
            <i class="fa fa-times" aria-hidden="true"></i><br>Delete Clip
          </button>
          <button class="col-sm-6 col-xs-6 delete-button" (ngModel)="select_tile" (click)="delete_tile(select_tile)">
            <i class="fa fa-times" aria-hidden="true"></i><br>Delete Tile
          </button>
        </li>
        <li class="row select">
          <select id="col-select" class="col-sm-12 col-xs-12" [(ngModel)]="select_tile.col" (click)="getPreTile(select_tile)" (change)="save_tile(select_tile)">
            <option *ngFor="let number of [1,2,3,4,5,6,7,8,9,10,11,12]">{{number}}</option>
          </select>
          <span class="col-size-icon col-sm-3 col-xs-3">
            <i class="fa fa-chevron-down fa-2x" aria-hidden="true"></i>
          </span>
        </li>
        <li>
          <tag-input class="tag-input" [(ngModel)]="select_tile.tag" [theme]="'bootstrap'"
          [placeholder]="'Enter a tile tag'" [secondaryPlaceholder]="'Enter a tile tag'"
          (click)="getPreTile(select_tile)" (onBlur)="save_tile(select_tile)"></tag-input>
        </li>
        <li>
          <tag-input class="tag-input" [(ngModel)]="clip_tag"
          [theme]="'bootstrap'" [placeholder]="'Enter a clip tag'" [secondaryPlaceholder]="'Enter a clip tag'"
          (onBlur)="update_cliptag(clip_tag)"></tag-input>
        </li>
      </ul>
    </nav>
  `,
        directives: WriteNav_1
    })
], WriteNav);
exports.WriteNav = WriteNav;
let ClipView = ClipView_1 = class ClipView {
    constructor() {
        this.clips = CLIP;
        this.find_tag = FindTag;
        this.date = DATE;
        this.tagsinput_placeholder = "Enter a search tag";
        this.error = false;
        this.BeEditing = new core_1.EventEmitter();
        this.datePickerConfig = {
            format: "MM/DD/YYYY"
        };
    }
    open() {
        this.dayPicker.api.open();
    }
    close() {
        this.dayPicker.api.close();
    }
    cliptagsubstitute(find_tag) {
        FindTag = tagsubstitute(find_tag);
    }
    errorCancel(event) {
        this.tagsinput_placeholder = "Enter a search tag";
        this.error = false;
    }
    search() {
        CLIP.length = 0;
        if (FindTag.length > 0) {
            socket.emit('send_clipsearchdata', {
                cliptags: FindTag,
                startdate: Date.parse(moment(DATE.start._d).format('MM/DD/YYYY')),
                enddate: Date.parse(moment(DATE.end._d).format('MM/DD/YYYY'))
            });
        }
        else {
            this.tagsinput_placeholder = "please input";
            this.error = true;
        }
    }
    load_tile(clip) {
        this.BeEditing.emit(true);
        initTile(clip, () => {
            Array.prototype.push.apply(TILE, clip.tile);
            Array.prototype.push.apply(Clip_Tag, clip.tag);
            clip_id = clip._id;
        });
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], ClipView.prototype, "sidebar_status", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], ClipView.prototype, "BeEditing", void 0);
__decorate([
    core_1.ViewChild('dayPicker'),
    __metadata("design:type", Object)
], ClipView.prototype, "dayPicker", void 0);
ClipView = ClipView_1 = __decorate([
    core_1.Component({
        selector: 'clip-view',
        template: `
    <!-- サイドバー(クリップ) -->
    <article [ngClass]="sidebar_status ? 'active' : ''" class="clip-bar">
      <tag-input class="clip-view-content" [ngClass]="error ? 'error':''" [(ngModel)]="find_tag" [theme]="'bootstrap'" [placeholder]="tagsinput_placeholder" [secondaryPlaceholder]="tagsinput_placeholder" (change)="errorCancel($event)" (onBlur)="cliptagsubstitute(find_tag)"></tag-input>
      <dp-date-picker [(ngModel)]="date.start" theme="dp-material clip-view-content" [config]="datePickerConfig"></dp-date-picker>
      <dp-date-picker [(ngModel)]="date.end" theme="dp-material clip-view-content" [config]="datePickerConfig"></dp-date-picker>
      <button (click)="search()">search</button>
      <div *ngFor="let clip of clips">
        <button (click)="load_tile(clip)">{{clip._id}}</button>
      </div>
    </article>
  `,
        directives: ClipView_1
    })
], ClipView);
exports.ClipView = ClipView;
let MenuBar = MenuBar_1 = class MenuBar {
    constructor() {
        this.togglesidebar = new core_1.EventEmitter();
        this.createnewclip = new core_1.EventEmitter();
    }
    createNewClip() {
        this.createnewclip.emit();
    }
    toggle_sidebar() {
        this.sidebar_status = !this.sidebar_status;
        this.togglesidebar.emit(this.sidebar_status);
    }
    toExport() {
        ipcRenderer.send(PATH_DATA.event, PATH_DATA.export_path);
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], MenuBar.prototype, "sidebar_status", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], MenuBar.prototype, "togglesidebar", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], MenuBar.prototype, "createnewclip", void 0);
MenuBar = MenuBar_1 = __decorate([
    core_1.Component({
        selector: 'menu-bar',
        template: `
    <!-- ナビゲーションバー(メニュー) -->
    <nav class="menu-bar">
      <article class="buttons">
        <button class="button" id="sidebar_toggle" (click)="toggle_sidebar()"><i class="fa fa-bars fa-2x"></i></button>

        <button class="button" id="create_button" title="Create Note" (click)="createNewClip()"><i class="fa fa-file-text-o fa-2x"></i></button>
        <button class="button" id="export_button" title="Export" (click)="toExport()"><i class="fa fa-file-pdf-o fa-2x"></i></button>
        <button class="button" id="setting_button" title="Settings"><i class="fa fa-cogs fa-2x"></i></button>
        <button class="button" title="Tools"><i class="fa fa-wrench fa-2x"></i></button>
        <button class="button" id="debug_button" title="Debug"><i class="fa fa-bug fa-2x"></i></button>

      </article>
    </nav>`,
        directives: MenuBar_1
    })
], MenuBar);
exports.MenuBar = MenuBar;
let AppComponent = class AppComponent {
    constructor(http) {
        this.http = http;
        this.tiles = TILE;
        this.select_tile = Select_Tile;
        this.isEditing = false;
        this.sidebar_status = false;
    }
    save_tile(tile) {
        //tileの新規保存
        if (!tile.saved) {
            if (tile.tag.length > 0) {
                let tag = tagsubstitute(tile.tag);
                this.http.post(saveTileURL, {
                    cid: clip_id,
                    idx: tile.idx,
                    col: tile.col,
                    tag: tag,
                    sty: tile.sty,
                    con: tile.con
                })
                    .subscribe(res => {
                    tile._id = res._body;
                });
            }
            else {
                this.http.post(saveTileURL, {
                    cid: clip_id,
                    idx: tile.idx,
                    col: tile.col,
                    tag: undefinedtag,
                    sty: tile.sty,
                    con: tile.con
                })
                    .subscribe(res => {
                    tile._id = res._body;
                });
            }
            tile.saved = true;
        }
        else {
            //tileの更新処理
            let diffkey = tilediff(tile, preTile);
            diffkey.forEach((key) => {
                switch (key) {
                    case "idx":
                        socket.emit('update_tileidx', {
                            idx: tile[key],
                            cid: clip_id,
                            tid: tile._id
                        });
                        break;
                    case "tag":
                        if (tile.tag.length > 0) {
                            let tag = tagsubstitute(tile.tag);
                            socket.emit('update_tiletag', {
                                tag: tag,
                                cid: clip_id,
                                tid: tile._id
                            });
                        }
                        else {
                            socket.emit('update_tiletag', {
                                tag: undefinedtag,
                                cid: clip_id,
                                tid: tile._id
                            });
                        }
                        break;
                    case "con":
                        socket.emit('update_tilecon', {
                            con: tile[key],
                            cid: clip_id,
                            tid: tile._id
                        });
                        break;
                    case "col":
                        socket.emit('update_tilecol', {
                            col: tile[key],
                            cid: clip_id,
                            tid: tile._id
                        });
                        break;
                    default:
                        break;
                }
            });
        }
    }
    getPreTile(tile) {
        preTile = {
            idx: tile.idx,
            col: tile.col,
            tag: tile.tag,
            sty: tile.sty,
            con: tile.con,
            _id: tile._id
        };
    }
    delete_clip() {
        //データベースのclip削除処理
        TILE.length = 0;
        socket.emit('delete_clip', clip_id);
        this.isEditing = false;
    }
    create_clip() {
        this.isEditing = true;
        socket.emit('save_clip', undefinedtag);
    }
    toggle_sidebar(stat) {
        this.sidebar_status = stat;
    }
};
AppComponent = __decorate([
    core_1.Component({
        selector: 'write-view',
        template: `
    <menu-bar [sidebar_status]="sidebar_status" (createnewclip)="create_clip()" (togglesidebar)="toggle_sidebar($event)"></menu-bar>
    <clip-view [sidebar_status]="sidebar_status" (BeEditing)="isEditing=$event"></clip-view>
    <div [style.visibility]="isEditing ? 'visible' : 'hidden'">
      <write-nav class="write-nav" [tiles]="tiles" [select_tile]="select_tile" (save_tilenav)="save_tile($event)" (getPreTilenav)="getPreTile($event)" (delete_clipedit)="delete_clip()"></write-nav>
      <article class="write-field">
        <write-clip [tiles]="tiles" [select_tile]="select_tile" (output)="select_tile=$event" (save_tileedit)="save_tile($event)" (getPreTileedit)="getPreTile($event)"></write-clip>
      </article>
    </div>
    <div [style.visibility]="isEditing ? 'hidden' : 'visible'" class="menu_container">
      <button (click)="create_clip()">create clip</button>
      <button (click)="toggle_sidebar(true)">load clip</button>
    <div>
    `,
        directives: [WriteClip, WriteNav, ClipView, MenuBar],
        inputs: ['tiles', 'select_tile', 'sidebar_status']
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
let initTile = (clip, callback) => {
    TILE.length = 0;
    Clip_Tag.length = 0;
    for (let i = 0; i < clip.tile.length; i++) {
        clip.tile[i].saved = true;
        clip.tile[i].edited = false;
    }
    callback();
};
let initClip = (callback) => {
    CLIP.length = 0;
    callback();
};
var WriteClip_1, WriteNav_1, ClipView_1, MenuBar_1;
//# sourceMappingURL=app.component.js.map