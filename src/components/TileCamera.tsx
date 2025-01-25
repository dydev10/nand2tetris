import React, { useCallback, useEffect, useRef, useState } from "react";
import layerImage from '../assets/tilemap1layer.png'
import Map from "../engine/Map";
import Camera2D from "../engine/Camera2D";
import Input from "../engine/Input";

const GAME_WIDTH = 512;
const GAME_HEIGHT = 512;
// const GAME_WIDTH = 768;
// const GAME_HEIGHT = 768;

function useTileMapRenderer(ctx: CanvasRenderingContext2D | null, showGrid: boolean) {
  const [map, setMap] = useState<Map|null>(null);
  const [camera, setCamera] = useState<Camera2D|null>(null);
  const [input, setInput] = useState<Input|null>(null);
  
  const frameRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number>(0);

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

  const drawLayer = useCallback((layer: number) => {
    if (!ctx || !map || !camera) return;

    const startCol = Math.floor(camera.x / map.tileSize);
    const endCol = startCol + (camera.width / map.tileSize);
    const startRow = Math.floor(camera.y / map.tileSize);
    const endRow = startRow + (camera.height / map.tileSize);
    
    const offsetX = -camera.x + startCol * map.tileSize;
    const offsetY = -camera.y + startRow * map.tileSize;

    // grid
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const tile = map.getTile(layer, col, row);
        const x = (col - startCol) * map.tileSize + offsetX;
        const y = (row - startRow) * map.tileSize + offsetY;

        ctx.drawImage(
          map.image,
          ((tile - 1) * map.imageTile) % map.image.width,  // sx,
          Math.floor((tile - 1) / map.imageCols) * map.imageTile,  // sy,
          map.imageTile,  // sw,
          map.imageTile,  // sh,
          Math.round(x),
          Math.round(y),
          map.tileSize,
          map.tileSize
        );

        if (showGrid) {
          ctx.strokeRect(
            Math.round(x),
            Math.round(y),
            map.tileSize,
            map.tileSize,
          );
        }
      }
    }
  }, [ctx, map, camera, showGrid]);
  
  const draw = useCallback(() => {
    if (!ctx) return;
    // setup canvas config
    ctx.imageSmoothingEnabled = false;

    drawLayer(0);
    drawLayer(1);
  }, [ctx, drawLayer]);

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
      /> */}

      <img
        alt="Hidden tilemap source img"
        src={layerImage}
        id="tilemap-source"
        style={{
          // visibility: 'hidden',
        }}
      />

      {/* <img
        alt="Hidden tilemap source img"
        src={fullImage}
        id="tilemap-source"
        style={{
          visibility: 'hidden',
        }}
      /> */}
      <button onClick={() => { setShowGrid(!showGrid) }}>Grid</button>
    </div>
  );
};

export default TileCamera;
