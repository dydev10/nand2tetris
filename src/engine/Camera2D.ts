import Map from "./Map";

export default class Camera2D {
  map: Map;
  speed: number;
  x: number;
  y: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
  
  constructor(map: Map, width: number, height: number) {
    this.map = map;
    this.width = width;
    this.height = height;
    
    this.speed = 256; // pixels/sec
    this.x = 128;
    this.y = 128;

    this.maxX = this.map.image.width - this.width;
    this.maxY = this.map.image.height  - this.height;
  }

  move = (deltaTime: number, speedX: number, speedY: number) => {
    this.x += speedX * this.speed * deltaTime;
    this.y += speedY * this.speed * deltaTime;

    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));
  }
}
