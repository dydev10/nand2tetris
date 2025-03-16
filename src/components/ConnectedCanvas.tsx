import React, { ChangeEvent, useState } from "react";
import useNodeHandlers from "../hooks/useNodeHandlers";
import useCanvasRendering from "../hooks/useCanvasRendering";
import useNodeStore from "../stores/useNodeStore";
import { SavedGate } from "../helpers/save";

export type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
  inputs: number[]; // Array of 0s and 1s
  outputs: number[]; // Array of 0s and 1s
  name: string;
  label?: string;
};

export type Connection = { fromBox: number; fromNode: number; toBox: number; toNode: number };

export type TempConnection = { fromX: number; fromY: number; toX: number; toY: number } | null;

const ConnectedCanvas: React.FC = () => {
  const loadNodes = useNodeStore(state => state.setupNodes);
  const savedGates = useNodeStore(state => state.savedGates);
  const saveGates = useNodeStore(state => state.saveGates);
  const addBox = useNodeStore(state => state.addBox);
  const [tempConnection, setTempConnection] = React.useState<TempConnection>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // dom ui stuff
  const [tempName, setTempName] = useState<string>('');


  const { handleNodeMouseDown, handleMouseMove, handleMouseUp } = useNodeHandlers(
    setTempConnection,
    canvasRef
  );
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      setCtx(canvas.getContext("2d"));

      const { width, height } = canvas.getBoundingClientRect();
      loadNodes(width, height);
    }
  }, [loadNodes]);

  useCanvasRendering(ctx, tempConnection);

  const handleSave = () => {
    saveGates(tempName);
  }

  const handleGateSelect = (saved: SavedGate) => {
    console.log(saved);
    addBox(saved.name, saved.table);
  }

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setTempName(value);
  };
  
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
      <div className="card">
        <input className="name" type="text" value={tempName} onChange={handleNameChange} />
      </div>
      <div>
        <button onClick={handleSave}>Save</button>
      </div>
      <div>
        {
          savedGates.map((gate, i) => <button key={`${gate.name}-${i}`} onClick={() => handleGateSelect(gate)}>{gate.name}</button>)
        }
      </div>
    </div>
  );
};

export default ConnectedCanvas;
