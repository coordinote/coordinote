import { Component }  from '@angular/core';

export class Tile {
  index: number;
  column: number;
  style: string;
  content: string;
}

var TILE: Tile[] = [];

@Component({
  selector: 'write-view',
  templateUrl: 'write/template/write.html'
})

export class AppComponent {
  title = "write";
  tiles = TILE;

  add_Tile(): void{
    TILE.push({
      "index": TILE.length,
      "column": 3,
      "style": "text",
      "content": ''
    });
  }

  log(): void{
    console.log(TILE);
    ipcRenderer.send('save_tile', TILE);
  }

  load(): void{
    ipcRenderer.send('load_clip', 'hoge');
  }

  save_clip(): void{
    ipcRenderer.send('save_clip', ['clip_test', 'test']);
  }

  ipcRenderer.on('load_clip', (event, message) => {
    console.log(message);
  })
}
