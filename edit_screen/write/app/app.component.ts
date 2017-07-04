import { Component, ElementRef, Renderer }  from '@angular/core';

export class Tile {
  cid: string;
  idx: number;
  col: number;
  tag: string;
  sty: string;
  con: string;
  edited: boolean;
}

var TILE: Tile[] = [];

var clip_id = "null";

@Component({
  selector: 'write-view',
  templateUrl: 'write/template/write.html'
})

export class AppComponent {
  title = "write";
  tiles = TILE;

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
      edited: true
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
    tile.edited = true;
    this.el.querySelector("#textarea" + tile.idx).style.visibility = "visible";
    this.renderer.invokeElementMethod(this.el.querySelector("#textarea" + tile.idx), 'focus');
  }

  unvisibleTextarea(tile): void{
    if(tile.con.match(/^[ 　\r\n\t]*$/)){
      TILE.splice(tile.idx, 1);
    }else{
      tile.edited = false;
      this.el.querySelector("#textarea" + tile.idx).style.visibility = "hidden";
      let input = this.el.querySelector("#textarea" + tile.idx);
      this.el.querySelector("#tile" + tile.idx).style.top = input.offsetTop + "px";
      this.el.querySelector("#tile" + tile.idx).style.left = input.offsetLeft + "px";
    }
  }
}
