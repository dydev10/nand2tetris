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
  const [tempConnection, setTempConnection] = React.useState<TempConnection>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const { handleNodeMouseDown, handleMouseMove, handleMouseUp } = useNodeHandlers(
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

  useCanvasRendering(ctx, tempConnection);
  
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
