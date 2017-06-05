import { Component }  from '@angular/core';

export class Tile {
  index: number;
  text: string;
  col_size: number;
  row_index: number;
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
      "index": 0,
      "text": '',
      "col_size": 3,
      "row_index": 1
    });
  }
}
