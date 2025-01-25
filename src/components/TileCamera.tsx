import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import sampleImage from '../assets/tilemap1simple.png'
import fullImage from '../assets/full_map.png'
import layerImage from '../assets/tilemap1layer.png'
import Map from "../engine/Map";
import Camera2D from "../engine/Camera2D";
import Input from "../engine/Input";

const GAME_WIDTH = 512;
const GAME_HEIGHT = 512;
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
  const [map, setMap] = useState<Map|null>(null);
  const [camera, setCamera] = useState<Camera2D|null>(null);
  const [input, setInput] = useState<Input|null>(null);
  
  const frameRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number>(0);
  const getTile = (level: LevelTiles, col: number, row: number): number => {
    return level[row * COLUMNS + col]
  }

  const updateCamera = useCallback((deltaTime: number) => {
    if (!ctx || !input || !camera) return;

    let speedX = 0;
    let speedY = 0;
    const { keys } = input;
    if (keys.length && keys[0] === 'KeyA') {
      speedX = -1;
    }
    if (keys.length && keys[0] === 'KeyD') {
      speedX = 1;
    }
    if (keys.length && keys[0] === 'KeyW') {
      speedY = -1;
    }
    if (keys.length && keys[0] === 'KeyS') {
      speedY = 1;
    }
    camera.move(deltaTime, speedX, speedY);
  }, [ctx, input, camera]);
  
  const draw = useCallback(() => {   
    if (!ctx || !map || !camera) return;

    // setup canvas config
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(
      map.image,
      camera.x,
      camera.y,
      GAME_WIDTH,
      GAME_HEIGHT,
      0,
      0,
      GAME_WIDTH,
      GAME_HEIGHT,
    );

    // rows
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLUMNS; col++) {
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
  }, [ctx, map, camera, showGrid]);

  const frame = useCallback((time: DOMHighResTimeStamp) => {
    const deltaTime = (time - prevTimeRef.current) / 1000; 
    prevTimeRef.current = time; 
    
    updateCamera(deltaTime);
    draw();
    
    frameRef.current = requestAnimationFrame(frame);
  }, [updateCamera, draw]);

  useEffect(() => {
    const newInput = new Input();
    const newMap = new Map();
    const newCamera = new Camera2D(newMap, GAME_WIDTH, GAME_HEIGHT);
    setMap(newMap);
    setCamera(newCamera);
    setInput(newInput);

    return () => {
      newInput.destroy();
    }
  }, []);

  // start frame loop
  useEffect(() => {
    frameRef.current = requestAnimationFrame(frame);
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    }
  }, [frame]);

  return draw;
}

const TileCamera: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

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
          width: '384px',
          height: '384px',
          imageRendering: 'pixelated',
        }}
      />
      
      {/* <img
        alt="Hidden tilemap source img"
        src={sampleImage}
        id="tilemap-source"
        style={{
          visibility: 'hidden',
        }}
      />
      <img
        alt="Hidden tilemap source img"
        src={sampleImage}
        id="tilemap-source"
        style={{
          visibility: 'hidden',
        }}
      /> */}
      <img
        alt="Hidden tilemap source img"
        src={fullImage}
        id="tilemap-source"
        style={{
          // visibility: 'hidden',
        }}
      />
      <button onClick={() => { setShowGrid(!showGrid) }}>Grid</button>
    </div>
  );
};

export default TileCamera;
