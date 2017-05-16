import { component }  from '@angular/core';

export class Tile {
  index: number;
  text: string;
  col_size: number;
  row_index: number;
}

const TILE_EG: Tile[] = [
  {
    "id": 2,
    "text": 'This tile number is 2',
    "col_size": 3,
    "row_index": 1
  },
  {
    "id": 1,
    "text": 'This tile number is 1',
    "col_size": 5,
    "row_index": 1
  },
  {
    "id": 3,
    "text": 'This tile number is 3',
    "col_size": 4,
    "row_index": 1
  },
  {
    "id": 4,
    "text": 'This tile number is 4',
    "col_size": 3,
    "row_index": 2
  },
  {
    "id": 5,
    "text": 'This tile number is 5',
    "col_size": 8,
    "row_index": 2
  },
  {
    "id": 6,
    "text": 'This tile number is 6',
    "col_size": 4,
    "row_index": 3
  }
];

@Component({
  selector: 'write-view',
  template: `
    <h1> {{title}}_view </h1>
  `
})
export class AppComponent {
  title = 'write';
  tile = TILE_EG;
}
