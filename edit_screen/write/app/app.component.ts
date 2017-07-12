import { Component, ElementRef, Renderer, Input, Output, EventEmitter }  from '@angular/core';

export class Tile {
  cid: string;
  idx: number;
  col: number;
  tag: string;
  sty: string;
  con: string;
  edited: boolean;
}

let TILE: Tile[] = [];

let clip_id = "null";

let Select_Tile: TIle = {};

@Component({
  selector: 'write-clip',
  templateUrl: 'write/template/write.html',
  directives: WriteClip
})

export class WriteClip{
  @Input() tiles: tiles;
  @Input() select_tile: tile_clip;
  @Output() output = new EventEmitter<select_tile>();

  constructor(private elementRef: ElementRef, private Renderer: Renderer){}
  el = this.elementRef.nativeElement;
  renderer = this.Renderer;

  add_tile(): void{
    TILE.push({
      cid: clip_id,
      idx: TILE.length,
      col: 3,
      tag: ["test", "やったあ"],
      sty: "txt",
      con: '',
      edited: false
    });
  }

  save_tile(): void{
    for(let i=0; i<TILE.length; i++){
      delete TILE[i].edited;
      console.log(TILE[i]);
    }
    if(clip_id === "null"){
      clip_id = ipcRenderer.sendSync('save_clip', ['clip_test', 'test']);
      for(let i=0; i<TILE.length; i++){
        TILE[i].cid = clip_id;
      }
      ipcRenderer.send('save_tile', TILE);
    }
  }

  load_clip(): void{
    console.log(ipcRenderer.sendSync('load_clip', clip_id));
  }

  save_clip(): void{
    clip_id = ipcRenderer.sendSync('save_clip', ['clip_test', 'test']);
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
}

@Component({
  selector: 'write-nav',
  template: `
    <nav class="col-sm-12">
      <input type="text" id="tile-tag-input" class="col-sm-9" [(ngModel)]="select_tile.tag">
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
}

@Component({
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

export class AppComponent{
  public tiles = TILE;
  public select_tile = Select_Tile;
}
