import { Component } from '@angular/core';

var CLIP: Clip[] = [];
var TILE: Tile[] = [];

@Component({
  selector: 'export-view',
  templateUrl: 'template/preview.html'
})

export class AppComponent  {
  clips = CLIP;
  tiles = TILE;

  append_clip(): void {
    CLIP.push({
      "con": 'test'
    });
  }

  append_tile(): void {
    TILE.push({
      "con": 'test'
    });
  }
}

