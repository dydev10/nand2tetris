import React from "react";
import useNodeHandlers from "../hooks/useNodeHandlers";
import useCanvasRendering from "../hooks/useCanvasRendering";

export type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
  inputs: number[]; // Array of 0s and 1s
  outputs: number[]; // Array of 0s and 1s
  name: string;
};

export type Connection = { fromBox: number; fromNode: number; toBox: number; toNode: number };

export type TempConnection = { fromX: number; fromY: number; toX: number; toY: number } | null;

const ConnectedCanvas: React.FC = () => {
  const [boxes, setBoxes] = React.useState<Box[]>([
    {
      x: 100,
      y: 100,
      width: 100,
      height: 75,
      inputs: [0, 1],
      outputs: [1, 0],
      name: "Box 1",
    },
    {
      x: 250,
      y: 150,
      width: 120,
      height: 80,
      inputs: [1],
      outputs: [0, 1, 1],
      name: "Box 2",
    },
  ]);

  const [connections, setConnections] = React.useState<Connection[]>([]);
  const [tempConnection, setTempConnection] = React.useState<TempConnection>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const { handleNodeMouseDown, handleMouseMove, handleMouseUp } = useNodeHandlers(
    boxes,
    setBoxes,
    connections,
    setConnections,
    setTempConnection,
    canvasRef
  );
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      setCtx(canvas.getContext("2d"));
    }
  }, []);

  const redraw = useCanvasRendering(ctx, boxes, connections, tempConnection);
  
  return (
    <div>
      <canvas
        ref={canvasRef}
        width={500}
        height={400}
        style={{ border: "1px solid black" }}
        onMouseMove={(e) => handleMouseMove(e)}
        onMouseDown={(e) => handleNodeMouseDown(e)}
        onMouseUp={(e) => handleMouseUp(e)}
        onMouseLeave={() => setTempConnection(null)} // Clear connection preview on mouse leave
      />
      {/* save, select UI here */}
    </div>
  );
};

export default ConnectedCanvas;