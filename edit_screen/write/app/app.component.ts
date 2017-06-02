import { Component }  from '@angular/core';

export class Tile {
  index: number;
  text: string;
  col_size: number;
  row_index: number;
}

const TILE_EG: Tile[] = [
  {
    "index": 2,
    "text": 'This tile number is 2',
    "col_size": 3,
    "row_index": 1
  },
  {
    "index": 1,
    "text": 'This tile number is 1',
    "col_size": 5,
    "row_index": 1
  },
  {
    "index": 3,
    "text": 'This tile number is 3',
    "col_size": 4,
    "row_index": 1
  },
  {
    "index": 4,
    "text": 'This tile number is 4',
    "col_size": 3,
    "row_index": 2
  },
  {
    "index": 5,
    "text": 'This tile number is 5',
    "col_size": 8,
    "row_index": 2
  },
  {
    "index": 6,
    "text": 'This tile number is 6',
    "col_size": 4,
    "row_index": 3
  }
];

@Component({
  selector: 'write-view',
  template: `
    <h1 class="col-sm-12">{{title}}</h1>
    <span *ngFor="let tile of tiles">
    <div class="col-sm-{{tile.col_size}} hoge">
      {{tile.text}}
    </div>
    </span>
  `
})
export class AppComponent {
  title = 'write';
  tiles = TILE_EG;
}
