import { Component }  from '@angular/core';

export class Tile {
  cid: string;
  idx: number;
  col: number;
  tag: string;
  sty: string;
  con: string;
}

var TILE: Tile[] = [];

var clip_id = null

@Component({
  selector: 'write-view',
  templateUrl: 'write/template/write.html'
})

export class AppComponent {
  title = "write";
  tiles = TILE;

  add_tile(): void{
    TILE.push({
      "cid": clip_id,
      "idx": TILE.length,
      "col": 3,
      "tag": ["test", "やったあ"],
      "sty": "txt",
      "con": ''
    });
  }

  save_tile(): void{
    console.log(TILE);
    if(clip_id !== null){
      ipcRenderer.send('save_tile', TILE);
    }
  }

  load_clip(): void{
    console.log(ipcRenderer.sendSync('load_clip', clip_id));
  }

  save_clip(): void{
    clip_id = ipcRenderer.sendSync('save_clip', ['clip_test', 'test']);
  }

}
