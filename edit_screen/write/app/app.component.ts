import { Component, Directive, ElementRef, EventEmitter, Input, Output, Renderer }  from '@angular/core';

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

let TILE: Tile[] = [];

let clip_id = "null";

let Select_Tile: TIle = {};

let preTile: Tile = {};

//'res_cidに変更
socket.on('return_cid', (cid) => {
  clip_id = cid
})

@Directive({
  selector: '[MathJax]'
})

export class MathJaxDirective {
  @Input('MathJax') texExpression: string;

  constructor(private el: ElementRef) {
  }

  ngOnChanges() {
   this.el.nativeElement.innerHTML = this.texExpression;
   MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.el.nativeElement]);
  }
}

@Component({
  selector: 'write-clip',
  templateUrl: 'write/template/write.html',
  directives: WriteClip
})

export class WriteClip{
  @Input() tiles: Tile;
  @Input() select_tile: tile_clip;
  @Output() output = new EventEmitter<select_tile>();
  @Output() save_tileedit = new EventEmitter<tile>()
  @Output() getPreTileedit = new EventEmitter<tile>()

  constructor(private elementRef: ElementRef, private Renderer: Renderer){}
  el = this.elementRef.nativeElement;
  renderer = this.Renderer;

  add_tile(): void{
    TILE.push({
      idx: TILE.length,
      col: 3,
      tag: ["hoge", "fuga"],
      sty: "txt",
      con: '',
      edited: false,
      saved: false,
      tid: null
    });
  }

  save_tile(tile){
    this.save_tileedit.emit(tile)
  }
/*
  load_clip(): void{
    console.log(ipcRenderer.sendSync('load_clip', clip_id));
  }
*/
  save_clip(): void{
    socket.emit('save_clip', ['clip_test', 'test'])
  }

  resize(textarea): void{
    let scrollHeight = this.el.querySelector("#" + textarea.id).scrollHeight;
    let height = this.el.querySelector("#" + textarea.id).offsetHeight;
    let lineHeight = this.el.querySelector("#" + textarea.id).style.lineHeight;
    lineHeight = parseInt(lineHeight.replace(/px/g, ""));
    if(scrollHeight > height){
      this.el.querySelector("#" + textarea.id).style.height = scrollHeight + "px";
    }else if(scrollHeight < height){
      this.el.querySelector("#" + textarea.id).style.height = height - lineHeight + "px";
    }
  }

  visibleTextarea(tile): void{
    let div = this.el.querySelector("#tile" + tile.idx)
    tile.edited = true;
    this.el.querySelector("#textarea" + tile.idx).style.visibility = "visible";
    this.renderer.invokeElementMethod(this.el.querySelector("#textarea" + tile.idx), 'focus');
    this.output.emit(tile)
    this.el.querySelector("#textarea" + tile.idx).style.top = div.offsetTop + "px";
    this.el.querySelector("#textarea" + tile.idx).style.left = div.offsetLeft + "px";
  }

  unvisibleTextarea(tile): void{
    if(tile.con.match(/^[ 　\r\n\t]*$/)){
      TILE.splice(tile.idx, 1);
    }else{
      tile.edited = false;
    }
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
      <tag-input class="tag-input" [(ngModel)]="select_tile.tag" [theme]="'bootstrap'" (click)="getPreTile(select_tile)" (blur)="save_tile(select_tile)"></tag-input>
      <select id="col-select" class="col-sm-3" [(ngModel)]="select_tile.col">
        <option *ngFor="let number of [1,2,3,4,5,6,7,8,9,10,11,12]">{{number}}</option>
      </select>
    </nav>
  `,
  directives: WriteNav
})

export class WriteNav{
  @Input() tiles: Tile
  @Input() select_tile
  @Output() getPreTilenav = new EventEmitter<tile>()
  @Output() save_tilenav = new EventEmitter<tile>()

  getPreTile(tile): void{
    this.getPreTilenav.emit(tile)
  }

  save_tile(tile): void{
    this.save_tilenav.emit(tile)
  }
}

@Component({
  selector: 'write-view',
  template: `
    <write-nav class="write-nav" [tiles]="tiles" [select_tile]="select_tile" (save_tilenav)="save_tile($event)" (getPreTilenav)="getPreTile($event)"></write-nav>
    <article class="write-field">
      <write-clip [tiles]="tiles" [select_tile]="select_tile" (output)="select_tile=$event" (save_tileedit)="save_tile($event)" (getPreTileedit)="getPreTile($event)"></write-clip>
    </article>
    `,
    directives: [WriteClip, WriteNav],
    inputs: ['tiles', 'select_tile']
})

export class AppComponent{
  public tiles = TILE;
  public select_tile = Select_Tile;

  save_tile(tile): void{
    if(!tile.con.match(/^[ 　\r\n\t]*$/)){
      //tileの新規保存
      if(!tile.saved){
        socket.emit('save_tile', {
          cid: clip_id
          idx: tile.idx,
          col: tile.col,
          tag: tile.tag,
          sty: tile.sty,
          con: tile.con
        })
      }else{
        //tileの更新処理
        let diffkey = tilediff(tile, preTile)
        diffkey.forEach((key) => {
          switch(key){
            case "idx":
              socket.emit('update_tileidx', {
                idx: tile[diffkey],
                cid: clip_id,
                tid: tile.tid
              })
              break;
            case "tag":
              socket.emit('update_tiletag', {
                tag: tile[diffkey],
                cid: clip_id,
                tid: tile.tid
              })
              break;
            case "con":
              socket.emit('update_tilecon', {
                con: tile[diffkey],
                cid: clip_id,
                tid: tile.tid
              })
              break;
            case "col":
              socket.emit('update_tilecol', {
                col: tile[diffkey],
                cid: clip_id,
                tid: tile.tid
              })
              break;
            default:
              break;
          }
        })
      }
      tile.saved = true
    }else{
      //データベースのtile削除処理
    }
  }

  getPreTile(tile){
    preTile = {
      cid: tile.cid;
      idx: tile.idx;
      col: tile.col;
      tag: tile.tag;
      sty: tile.sty;
      con: tile.con;
      tid: tile.tid;
    };
    console.log(preTile)
  }
}

let tilediff(tile: Tile, preTile: Tile){
  let keys = Object.keys(tile)
  let diffProp = []

  keys.forEach((key) => {
    if(tile[key] !== preTile[key]){
      diffProp.push(key)
    }
  })
  return diffProp
}
