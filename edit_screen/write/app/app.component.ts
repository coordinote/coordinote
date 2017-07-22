import { AterViewInit, Component, Directive, ElementRef, EventEmitter, Input, Output, Renderer }  from '@angular/core'

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
  tid: string;
}

let TILE: Tile[] = []

let clip_id = null

let Clip_Tag = []

let Select_Tile: Tile = {}

let preTile: Tile = {}

socket.on('res_cid', (cid) => {
  clip_id = cid
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
        tid: null
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
        tid: null
      })
    })
  }

  save_tile(tile): void{
    this.save_tileedit.emit(tile)
  }

  save_svg(tile, dom): void{
    if(!tile.saved){
      let tag = tagsubstitute(tile.tag)
      this.http.post('http://localhost:6277/api/save_tile', {
        cid: clip_id,
        idx: tile.idx,
        col: tile.col,
        tag: tag,
        sty: tile.sty,
        con: []
      })
      .subscribe(res => {
        tile.tid = res._body
        dom.contentWindow.save_cidtid(clip_id, tile.tid)
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
      tid: tile.tid
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
    console.log(Clip_Tag)
  }
}

@Component({
  selector: 'write-nav',
  template: `
    <nav class="col-sm-12">
      <button class="col-sm-1" (ngModel)="select_tile" (click)="delete_tile(select_tile)">X</button>
      <select id="col-select" class="col-sm-1" [(ngModel)]="select_tile.col">
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
    clip_tag = tagsubstitute(clip_tag)
    Clip_Tag = clip_tag
    socket.emit('update_cliptag', {
      clip_tags: clip_tag,
      cid: clip_id
    })
  }

  getPreTile(tile): void{
    this.getPreTilenav.emit(tile)
  }

  save_tile(tile): void{
    this.save_tilenav.emit(tile)
  }

  delete_tile(tile){
    console.log(tile)
    /*socket.emit('delete_tile', {
      cid: clip_id,
      tid: tile.tid
    })*/
  }
}

@Component({
  selector: 'write-view',
  template: `
    <write-nav class="write-nav" [tiles]="tiles" [select_tile]="select_tile" (save_tilenav)="save_tile($event)" (getPreTilenav)="getPreTile($event)"></write-nav>
    <article class="write-field">
      <write-clip [tiles]="tiles" [select_tile]="select_tile" (output)="select_tile=$event" (save_tileedit)="save_tile($event)" (getPreTileedit)="getPreTile($event)" (delete_clipedit)="delete_clip()"></write-clip>
    </article>
    `,
    directives: [WriteClip, WriteNav],
    inputs: ['tiles', 'select_tile']
})

export class AppComponent{
  public tiles = TILE
  public select_tile = Select_Tile

  constructor(private http: Http){}

  save_tile(tile): void{
    //tileの新規保存
    if(!tile.saved){
      let tag = tagsubstitute(tile.tag)
      this.http.post('http://localhost:6277/api/save_tile', {
        cid: clip_id,
        idx: tile.idx,
        col: tile.col,
        tag: tag,
        sty: tile.sty,
        con: tile.con
      })
      .subscribe(res => {
        tile.tid = res._body
      })
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
              tid: tile.tid
            })
            break
          case "tag":
            let tag = tagsubstitute(tile.tag)
            socket.emit('update_tiletag', {
              tag: tag,
              cid: clip_id,
              tid: tile.tid
            })
            break
          case "con":
            socket.emit('update_tilecon', {
              con: tile[key],
              cid: clip_id,
              tid: tile.tid
            })
            break
          case "col":
            socket.emit('update_tilecol', {
              col: tile[key],
              cid: clip_id,
              tid: tile.tid
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
      tid: tile.tid
    }
  }

  ngAfterViewInit(){
    socket.emit('save_clip', ['clip_test', 'test'])
  }

  delete_clip(): void{
    //データベースのclip削除処理
    socket.emit('delete_clip', clip_id)
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
