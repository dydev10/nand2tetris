export default class Map {
  image: HTMLImageElement;

  cols: number;
  rows: number;
  tileSize: number;
  
  constructor() {
    this.image = document.getElementById('tilemap-source') as HTMLImageElement;

    this.cols = 12;
    this.rows = 12;
    this.tileSize = 64;
  }
}
