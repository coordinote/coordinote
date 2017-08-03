import { AterViewInit, Component, Directive, ElementRef, EventEmitter, Input, Output, Pipe, PipeTransform, Renderer, ViewChild }  from '@angular/core'
import { DomSanitizer} from '@angular/platform-browser';
import * as moment from 'moment'

import { Http } from '@angular/http'

const socket = io.connect('http://localhost:6277')

export class Tile {
  idx: number;
  col: number;
  tag: string;
  sty: string;
  con: string;
  edited: boolean;
  saved: boolean;
  _id: string;
}

const undefinedtag = ['undefined']

const saveTileURL = 'http://localhost:6277/api/save_tile'

let TILE: Tile[] = []

let clip_id = null

let CLIP = []

let Clip_Tag = []

let Select_Tile: Tile = {}

let preTile: Tile = {}

let FindTag = []

let DATE = {
  start: moment(),
  end: moment()
}

socket.on('res_cid', (cid) => {
  clip_id = cid
})

socket.on('res_clips', (clips) => {
  initClip(() => {
    Array.prototype.push.apply(CLIP, clips)
  })
})

@Directive({
  selector: '[MathJax]'
})

export class MathJaxDirective {
  @Input('MathJax') texExpression: string

  constructor(private el: ElementRef) {
  }

  ngOnChanges() {
   this.el.nativeElement.innerHTML = this.texExpression
   MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.el.nativeElement])
  }
}

@Pipe({ name: 'safe' })

export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'write-clip',
  templateUrl: 'write/template/write.html',
  directives: WriteClip,
  styleUrls: ['write/template/canvas_iframe.css']
})

export class WriteClip{
  @Input() tiles: Tile
  @Input() select_tile: tile_clip
  @Output() output = new EventEmitter<select_tile>()
  @Output() save_tileedit = new EventEmitter<tile>()
  @Output() getPreTileedit = new EventEmitter<tile>()
  @Output() delete_clipedit = new EventEmitter()
  private CanvasURL: string = "http://localhost:6277/html/read/"

  constructor(private elementRef: ElementRef, private Renderer: Renderer, private http: Http){}
  el = this.elementRef.nativeElement
  renderer = this.Renderer

  add_tile(): void{
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
      })
    })
  }

  add_canvas(): void{
    tilesort(() => {
      TILE.push({
        idx: TILE.length,
        col: 3,
        tag: [],
        sty: "svg",
        con: '',
        saved: false,
        _id: null
      })
    })
  }

  save_tile(tile): void{
    this.save_tileedit.emit(tile)
  }

  save_svg(tile, dom): void{
    if(!tile.saved){
      let tag = tagsubstitute(tile.tag)
      this.http.post(saveTileURL, {
        cid: clip_id,
        idx: tile.idx,
        col: tile.col,
        tag: tag,
        sty: tile.sty,
        con: []
      })
      .subscribe(res => {
        tile._id = res._body
        dom.contentWindow.save_cidtid(clip_id, tile._id)
        dom.contentWindow.sendReadID()
      })
      tile.saved = true
    }
  }

  delete_tile(tile): void {
    TILE.splice(tile.idx, 1)
    tilesort(() => {})
    //データベースのtile削除処理
    socket.emit('delete_tile', {
      cid: clip_id,
      tid: tile._id
    })
  }

  delete_clip(): void {
    this.delete_clipedit.emit()
  }

  resize(textarea): void{
    let scrollHeight = this.el.querySelector("#" + textarea.id).scrollHeight
    let height = this.el.querySelector("#" + textarea.id).offsetHeight
    let lineHeight = this.el.querySelector("#" + textarea.id).style.lineHeight
    lineHeight = parseInt(lineHeight.replace(/px/g, ""))
    if(scrollHeight > height){
      this.el.querySelector("#" + textarea.id).style.height = scrollHeight + "px"
    }else if(scrollHeight < height){
      this.el.querySelector("#" + textarea.id).style.height = height - lineHeight + "px"
    }
  }

  visibleTextarea(tile, dom): void{
    // case of text
    if(tile.sty === "txt"){
      let div = this.el.querySelector("#tile" + tile.idx)
    tile.edited = true
    this.el.querySelector("#textarea" + tile.idx).style.visibility = "visible"
    this.renderer.invokeElementMethod(this.el.querySelector("#textarea" + tile.idx), 'focus')
    this.output.emit(tile)
    this.el.querySelector("#textarea" + tile.idx).style.top = div.offsetTop + "px"
    this.el.querySelector("#textarea" + tile.idx).style.left = div.offsetLeft + "px"
    }
    // case of canvas
    else if(tile.sty === "svg"){
      if(tile.saved){
        dom.contentWindow.sendReadID()
      }
      this.output.emit(tile)
    }
  }

  unvisibleTextarea(tile): void{
    tile.edited = false
  }

  getPreTile(tile): void{
    this.getPreTileedit.emit(tile)
  }

  test() {
    console.log(TILE)
  }
}

@Component({
  selector: 'write-nav',
  template: `
    <nav class="col-sm-12">
      <button class="col-sm-1" (ngModel)="select_tile" (click)="delete_tile(select_tile)">
        <i class="fa fa-times" aria-hidden="true"></i>
      </button>
      <select id="col-select" class="col-sm-1" [(ngModel)]="select_tile.col" (click)="getPreTile(select_tile)" (change)="save_tile(select_tile)">
        <option *ngFor="let number of [1,2,3,4,5,6,7,8,9,10,11,12]">{{number}}</option>
      </select>
      <tag-input class="tag-input col-sm-5" [(ngModel)]="select_tile.tag" [theme]="'bootstrap'" [placeholder]="'Enter a tile tag'" [secondaryPlaceholder]="'Enter a tile tag'" (click)="getPreTile(select_tile)" (onBlur)="save_tile(select_tile)"></tag-input>
      <tag-input class="tag-input col-sm-5" [(ngModel)]="clip_tag" [theme]="'bootstrap'" [placeholder]="'Enter a clip tag'" [secondaryPlaceholder]="'Enter a clip tag'" (onBlur)="update_cliptag(clip_tag)"></tag-input>
    </nav>
  `,
  directives: WriteNav
})

export class WriteNav{
  @Input() tiles: Tile
  @Input() select_tile
  @Output() getPreTilenav = new EventEmitter<tile>()
  @Output() save_tilenav = new EventEmitter<tile>()
  private clip_tag = Clip_Tag

  update_cliptag(clip_tag): void{
    if(clip_tag.length > 0){
      clip_tag = tagsubstitute(clip_tag)
      Clip_Tag = clip_tag
      socket.emit('update_cliptag', {
        clip_tags: clip_tag,
        cid: clip_id
      })
    }else{
      socket.emit('update_cliptag', {
        clip_tags: undefinedtag,
        cid: clip_id
      })
    }
  }

  getPreTile(tile): void{
    this.getPreTilenav.emit(tile)
  }

  save_tile(tile): void{
    this.save_tilenav.emit(tile)
  }

  delete_tile(tile){
    TILE.splice(tile.idx, 1)
    tilesort(() => {})
    socket.emit('delete_tile', {
      cid: clip_id,
      tid: tile._id
    })
  }
}

@Component({
  selector: 'clip-view',
  template:`
    <!-- サイドバー(クリップ) -->
    <article class="clip-bar">
      <tag-input class="clip-view-tagsinput-content" [ngClass]="error ? 'error':''" [(ngModel)]="find_tag" [theme]="'bootstrap'" [placeholder]="tagsinput_placeholder" [secondaryPlaceholder]="tagsinput_placeholder" (change)="errorCancel($event)" (onBlur)="cliptagsubstitute(find_tag)"></tag-input>
      <dp-date-picker class="clip-view-content" [(ngModel)]="date.start" theme="dp-material" [config]="datePickerConfig"></dp-date-picker>
      <dp-date-picker class="clip-view-content" [(ngModel)]="date.end" theme="dp-material" [config]="datePickerConfig"></dp-date-picker>
      <button (click)="search()">search</button>
      <div *ngFor="let clip of clips">
        <button (click)="load_tile(clip)">{{clip._id}}</button>
      </div>
    </article>
  `,
  directives: ClipView
})

export class ClipView{
  clips = CLIP
  find_tag = FindTag
  date = DATE
  tagsinput_placeholder = "Enter a search tag"
  error:boolean = false
  @ViewChild('dayPicker') dayPicker: DpDayPickerComponent;

  datePickerConfig = {
    format: "MM/DD/YYYY"
  }

  open() {
    this.dayPicker.api.open();
  }

  close() {
    this.dayPicker.api.close();
  }

  cliptagsubstitute(find_tag): void{
    FindTag = tagsubstitute(find_tag)
  }

  errorCancel(event): void{
    this.tagsinput_placeholder = "Enter a search tag"
    this.error = false
  }

  search(): void{
    CLIP.length = 0
    if(FindTag.length>0){
      socket.emit('send_clipsearchdata', {
        cliptags: FindTag,
        startdate: Date.parse(moment(DATE.start._d).format('MM/DD/YYYY')),
        enddate: Date.parse(moment(DATE.end._d).format('MM/DD/YYYY'))
      })
    }else{
      this.tagsinput_placeholder = "please input"
      this.error = true
    }
  }

  load_tile(clip): void{
    initTile(clip, () => {
      Array.prototype.push.apply(TILE, clip.tile)
      Array.prototype.push.apply(Clip_Tag, clip.tag)
      clip_id = clip._id
    })
  }
}

@Component({
  selector: 'write-view',
  template: `
    <clip-view></clip-view>
    <write-nav class="write-nav" [tiles]="tiles" [select_tile]="select_tile" (save_tilenav)="save_tile($event)" (getPreTilenav)="getPreTile($event)"></write-nav>
    <article class="write-field">
      <write-clip [tiles]="tiles" [select_tile]="select_tile" (output)="select_tile=$event" (save_tileedit)="save_tile($event)" (getPreTileedit)="getPreTile($event)" (delete_clipedit)="delete_clip()"></write-clip>
    </article>
    `,
    directives: [WriteClip, WriteNav, ClipView],
    inputs: ['tiles', 'select_tile']
})

export class AppComponent{
  public tiles = TILE
  public select_tile = Select_Tile

  constructor(private http: Http){}

  save_tile(tile): void{
    //tileの新規保存
    if(!tile.saved){
      if(tile.tag.length > 0){
        let tag = tagsubstitute(tile.tag)
        this.http.post(saveTileURL, {
          cid: clip_id,
          idx: tile.idx,
          col: tile.col,
          tag: tag,
          sty: tile.sty,
          con: tile.con
        })
        .subscribe(res => {
          tile._id = res._body
        })
      }else{
        this.http.post(saveTileURL, {
          cid: clip_id,
          idx: tile.idx,
          col: tile.col,
          tag: undefinedtag,
          sty: tile.sty,
          con: tile.con
        })
        .subscribe(res => {
          tile._id = res._body
        })
      }
      tile.saved = true
    }else{
      //tileの更新処理
      let diffkey = tilediff(tile, preTile)
      diffkey.forEach((key) => {
        switch(key){
          case "idx":
            socket.emit('update_tileidx', {
              idx: tile[key],
              cid: clip_id,
              tid: tile._id
            })
            break
          case "tag":
            if(tile.tag.length > 0){
              let tag = tagsubstitute(tile.tag)
              socket.emit('update_tiletag', {
                tag: tag,
                cid: clip_id,
                tid: tile._id
              })
            }else{
              socket.emit('update_tiletag', {
                tag: undefinedtag,
                cid: clip_id,
                tid: tile._id
              })
            }
            break
          case "con":
            socket.emit('update_tilecon', {
              con: tile[key],
              cid: clip_id,
              tid: tile._id
            })
            break
          case "col":
            socket.emit('update_tilecol', {
              col: tile[key],
              cid: clip_id,
              tid: tile._id
            })
            break
          default:
            break
        }
      })
    }
  }

  getPreTile(tile){
    preTile = {
      idx: tile.idx,
      col: tile.col,
      tag: tile.tag,
      sty: tile.sty,
      con: tile.con,
      _id: tile._id
    }
  }

  ngAfterViewInit(){
    socket.emit('save_clip', undefinedtag)
  }

  delete_clip(): void{
    //データベースのclip削除処理
    TILE.length = 0
    socket.emit('delete_clip', clip_id)
    ipcRenderer.send(PATH_DATA.event, PATH_DATA.splash_path)
  }
}

let tilediff = (tile: Tile, preTile: Tile) => {
  let keys = Object.keys(tile)
  let diffProp = []

  keys.forEach((key) => {
    if(tile[key] !== preTile[key]){
      diffProp.push(key)
    }
  })
  return diffProp
}

let tilesort = (callback) => {
  TILE.sort((tile1, tile2) => {
    return tile1.idx - tile2.idx
  })
  for(let i=0; i<TILE.length; i++){
    TILE[i].idx = i
  }
  callback()
}

let tagsubstitute = (tag) => {
  let tag_array = []
  tag.forEach((input_tag) => {
    tag_array.push(input_tag.value)
  })
  return tag_array
}

let initTile = (clip, callback) => {
  TILE.length = 0
  Clip_Tag.length = 0
  for(let i=0; i<clip.tile.length; i++){
    clip.tile[i].saved = true
    clip.tile[i].edited = false
  }
  callback()
}

let initClip = (callback) => {
  CLIP.length = 0
  callback()
}
