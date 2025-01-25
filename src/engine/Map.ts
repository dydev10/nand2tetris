
export type LayerTiles = number[];

export default class Map {
  cols: number;
  rows: number;
  tileSize: number;
  
  image: HTMLImageElement;
  imageTile: number;
  imageCols: number;

  // multiplayer tileMap data model
  layers: number[][];

  constructor() {
    this.cols = 12;
    this.rows = 12;
    this.tileSize = 64;

    this.image = document.getElementById('tilemap-source') as HTMLImageElement;
    this.imageTile = 32;
    this.imageCols = this.image.width / this.imageTile;

    this.layers = [
      [
        18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18,
        18, 1, 2, 2, 2, 2, 3, 18, 18, 18, 18, 18,
        18, 6, 7, 7, 7, 7, 8, 18, 18, 18, 18, 18,
        18, 6, 7, 16, 12, 17, 8, 18, 18, 18, 18, 18,
        18, 6, 7, 21, 2, 22, 8, 18, 18, 18, 18, 18,
        18, 6, 7, 7, 7, 7, 8, 18, 18, 18, 18, 18,
        18, 11, 12, 12, 12, 12, 13, 18, 18, 18, 18, 18,
        18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18,
        18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18,
        18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18,
        18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18,
        18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18,
      ],
      [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 23, 0, 5, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 20, 0, 10, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 20, 25, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
    ];
  }

  getTile = (layer: number, col: number, row: number): number => {
    return this.layers[layer][row * this.cols + col]
  }
}
