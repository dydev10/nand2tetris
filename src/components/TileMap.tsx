import React, { useState } from "react";
import sampleImage from '../assets/tilemap1simple.png'

const GAME_WIDTH = 160;
const GAME_HEIGHT = 160;
const GAME_TILE = 32;
const ROWS = GAME_HEIGHT / GAME_TILE;
const COLUMNS = GAME_WIDTH / GAME_TILE;

export type LevelTiles = number[];

// tilemap id index starts from 1 to n
// example level data
const LEVEL_1: LevelTiles = [
  2, 2, 2, 3, 9,
  12, 12, 7, 8, 9,
  9, 4, 7, 8, 9,
  9, 5, 7, 8, 9,
  9, 10, 7, 8, 9,
];


function useTileMapRenderer(ctx: CanvasRenderingContext2D | null, showGrid: boolean) {
  const getTile = (level: LevelTiles, col: number, row: number): number => {
    return level[row * COLUMNS + col]
  }
  
  const redraw = React.useCallback(() => {   
    if (ctx) {
      // setup canvas config
      ctx.imageSmoothingEnabled = false;
      const TILE_IMAGE_SOURCE = document.getElementById('tilemap-source') as HTMLImageElement;
      const IMAGE_TILE = 32;
      const IMAGE_COLS = TILE_IMAGE_SOURCE.width / IMAGE_TILE;;
      
      // ctx.drawImage(
      //   TILE_IMAGE_SOURCE,
      //   4 * IMAGE_TILE,  // sx,
      //   1 * IMAGE_TILE,  // sy,
      //   IMAGE_TILE,  // sw,
      //   IMAGE_TILE,  // sh,
      //   0 * GAME_TILE,
      //   0 * GAME_TILE,
      //   GAME_TILE,
      //   GAME_TILE
      // );


      // rows
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLUMNS; col++) {
          const tile = getTile(LEVEL_1, col, row);
          ctx.drawImage(
            TILE_IMAGE_SOURCE,
            ((tile - 1) * IMAGE_TILE) % TILE_IMAGE_SOURCE.width,  // sx,
            Math.floor((tile - 1) / IMAGE_COLS) * IMAGE_TILE,  // sy,
            IMAGE_TILE,  // sw,
            IMAGE_TILE,  // sh,
            col * GAME_TILE,
            row * GAME_TILE,
            GAME_TILE,
            GAME_TILE
          );

          if (showGrid) {
            ctx.strokeRect(
              col * GAME_TILE,
              row * GAME_TILE,
              GAME_TILE,
              GAME_TILE,
            );
          }
        }
        
      }
    }
    
  }, [ctx, showGrid]);

  React.useEffect(() => {
    redraw();
    console.log('Redrawing useTileMapRenderer');
  }, [redraw]);

  return redraw;
}

const TileMap: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);

  // ui 
  const [showGrid, setShowGrid] = useState<boolean>(true);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      setCtx(canvas.getContext("2d"));
      canvas.width = GAME_WIDTH;
      canvas.height = GAME_HEIGHT;
    }
  }, []);

  useTileMapRenderer(ctx, showGrid);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{
          border: '1px solid black',
          background: '#ffaaaa',
          width: '320px',
          height: '320px',
          imageRendering: 'pixelated',
        }}
      />
      
      <img
        alt="Hidden tilemap source img"
        src={sampleImage}
        id="tilemap-source"
        style={{
          visibility: 'hidden',
        }}
        />
        <button onClick={() => { setShowGrid(!showGrid) }}>Grid</button>
    </div>
  );
};

export default TileMap;
