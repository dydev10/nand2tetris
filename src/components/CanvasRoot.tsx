import React from "react";

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
  inputs: number[]; // Array of 0s and 1s
  outputs: number[]; // Array of 0s and 1s
  name: string;
};

type Connection = { fromBox: number; fromNode: number; toBox: number; toNode: number };

function useCanvasRendering(
  ctx: CanvasRenderingContext2D | null,
  boxes: Box[],
  connections: Connection[],
  tempConnection: { fromX: number; fromY: number; toX: number; toY: number } | null
) {
  const redraw = React.useCallback(() => {
    if (!ctx) return;
  
    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
    // Set the background color
    ctx.fillStyle = "lightgray";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
    // Draw each box
    boxes.forEach((box) => {
      // Draw box
      ctx.fillStyle = "red";
      ctx.fillRect(box.x, box.y, box.width, box.height);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 5;
      ctx.strokeRect(box.x, box.y, box.width, box.height);
  
      // Draw box name
      ctx.fillStyle = "white";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(box.name, box.x + box.width / 2, box.y + box.height / 2);
  
      // Draw input nodes
      const nodeRadius = 5;
      const inputSpacing = box.height / (box.inputs.length + 1);
      box.inputs.forEach((state, index) => {
        const nodeX = box.x - 10;
        const nodeY = box.y + inputSpacing * (index + 1);
        ctx.fillStyle = state === 1 ? "green" : "gray"; // Active: green, Inactive: gray
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, nodeRadius, 0, Math.PI * 2);
        ctx.fill();
      });
  
      // Draw output nodes
      const outputSpacing = box.height / (box.outputs.length + 1);
      box.outputs.forEach((state, index) => {
        const nodeX = box.x + box.width + 10;
        const nodeY = box.y + outputSpacing * (index + 1);
        ctx.fillStyle = state === 1 ? "blue" : "gray"; // Active: blue, Inactive: gray
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, nodeRadius, 0, Math.PI * 2);
        ctx.fill();
      });
    });
  
    // Draw connections
    connections.forEach((connection) => {
      const fromBox = boxes[connection.fromBox];
      const toBox = boxes[connection.toBox];
  
      if (fromBox && toBox) {
        const fromX = fromBox.x + fromBox.width + 10; // Right side output
        const fromY =
          fromBox.y + (fromBox.height / (fromBox.outputs.length + 1)) * (connection.fromNode + 1);
        const toX = toBox.x - 10; // Left side input
        const toY =
          toBox.y + (toBox.height / (toBox.inputs.length + 1)) * (connection.toNode + 1);
  
        // Determine connection color based only on the starting output node state
        const connectionColor = fromBox.outputs[connection.fromNode] === 1 ? "green" : "black";
  
        ctx.strokeStyle = connectionColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
      }
    });
  
    // Draw the temporary connection (while dragging)
    if (tempConnection) {
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tempConnection.fromX, tempConnection.fromY);
      ctx.lineTo(tempConnection.toX, tempConnection.toY);
      ctx.stroke();
    }
  }, [ctx, boxes, connections, tempConnection]);

  React.useEffect(() => {
    redraw();
    console.log('Redrawing');
    
  }, [redraw]);

  return redraw;
}

const CanvasRoot: React.FC = () => {
  const [boxes, setBoxes] = React.useState<Box[]>([
    {
      x: 100,
      y: 100,
      width: 100,
      height: 75,
      inputs: [0, 1], // Example inputs
      outputs: [1, 0], // Example outputs
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
  const [isDraggingBox, setIsDraggingBox] = React.useState(false);
  const [draggingBoxIndex, setDraggingBoxIndex] = React.useState<number | null>(null);
  const [dragOffset, setDragOffset] = React.useState<{ x: number; y: number } | null>(null);
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [connectionStart, setConnectionStart] = React.useState<{ box: number; node: number } | null>(
    null
  );
  const [tempConnection, setTempConnection] = React.useState<{
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
  } | null>(null); // Temporary connection state for preview
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      setCtx(canvas.getContext("2d"));
    }
  }, []);

  useCanvasRendering(ctx, boxes, connections, tempConnection);

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
  
    let nodeClicked = false;
  
    // Check if the click is near a connection line
    connections.forEach((connection, index) => {
      const fromBox = boxes[connection.fromBox];
      const toBox = boxes[connection.toBox];
  
      if (fromBox && toBox) {
        const fromX = fromBox.x + fromBox.width + 10; // Right side output
        const fromY =
          fromBox.y + (fromBox.height / (fromBox.outputs.length + 1)) * (connection.fromNode + 1);
        const toX = toBox.x - 10; // Left side input
        const toY =
          toBox.y + (toBox.height / (toBox.inputs.length + 1)) * (connection.toNode + 1);
  
        // Check if the click is near this connection line
        const distance =
          Math.abs((toY - fromY) * mouseX - (toX - fromX) * mouseY + toX * fromY - toY * fromX) /
          Math.sqrt((toY - fromY) ** 2 + (toX - fromX) ** 2);
  
        if (distance < 5) {
          // Delete the connection
          setConnections((prev) => prev.filter((_, i) => i !== index));
          nodeClicked = true;
        }
      }
    });
  
    if (nodeClicked) return; // Prevent further actions if a connection was deleted
  
    // Existing logic for nodes and box dragging...
    // Check if a node is clicked for connection (Output Node)
    boxes.forEach((box, boxIndex) => {
      const outputSpacing = box.height / (box.outputs.length + 1);
      box.outputs.forEach((_, outputIndex) => {
        const nodeX = box.x + box.width + 10;
        const nodeY = box.y + outputSpacing * (outputIndex + 1);
        const distance = Math.sqrt((mouseX - nodeX) ** 2 + (mouseY - nodeY) ** 2);
        if (distance <= 5) {
          setIsConnecting(true);
          setConnectionStart({ box: boxIndex, node: outputIndex });
          nodeClicked = true;
        }
      });
    });
  
    // Check if an input node is clicked to toggle its state
    if (!nodeClicked) {
      boxes.forEach((box, boxIndex) => {
        const inputSpacing = box.height / (box.inputs.length + 1);
        box.inputs.forEach((_, inputIndex) => {
          const nodeX = box.x - 10;
          const nodeY = box.y + inputSpacing * (inputIndex + 1);
          const distance = Math.sqrt((mouseX - nodeX) ** 2 + (mouseY - nodeY) ** 2);
          if (distance <= 5) {
            // Toggle the input node state
            setBoxes((prevBoxes) =>
              prevBoxes.map((b, i) =>
                i === boxIndex
                  ? {
                      ...b,
                      inputs: b.inputs.map((state, j) =>
                        j === inputIndex ? (state === 1 ? 0 : 1) : state
                      ),
                    }
                  : b
              )
            );
            nodeClicked = true;
          }
        });
      });
    }
  
    // If no node is clicked, check for box dragging
    if (!nodeClicked) {
      boxes.forEach((box, index) => {
        if (
          mouseX >= box.x &&
          mouseX <= box.x + box.width &&
          mouseY >= box.y &&
          mouseY <= box.y + box.height
        ) {
          setIsDraggingBox(true);
          setDraggingBoxIndex(index);
          setDragOffset({ x: mouseX - box.x, y: mouseY - box.y });
        }
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isDraggingBox && draggingBoxIndex !== null && dragOffset) {
      setBoxes((prev) =>
        prev.map((box, index) =>
          index === draggingBoxIndex
            ? { ...box, x: mouseX - dragOffset.x, y: mouseY - dragOffset.y }
            : box
        )
      );
    }

    // Update temporary connection line while dragging
    if (isConnecting && connectionStart) {
      const fromBox = boxes[connectionStart.box];
      const fromX = fromBox.x + fromBox.width + 10;
      const fromY =
        fromBox.y + (fromBox.height / (fromBox.outputs.length + 1)) * (connectionStart.node + 1);
      setTempConnection({ fromX, fromY, toX: mouseX, toY: mouseY });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isConnecting && connectionStart) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Check if the mouse is over an input node (for connection end)
      boxes.forEach((box, boxIndex) => {
        const inputSpacing = box.height / (box.inputs.length + 1);
        box.inputs.forEach((_, inputIndex) => {
          const nodeX = box.x - 10;
          const nodeY = box.y + inputSpacing * (inputIndex + 1);
          const distance = Math.sqrt((mouseX - nodeX) ** 2 + (mouseY - nodeY) ** 2);
          if (distance <= 5) {
            setConnections((prev) => [
              ...prev,
              {
                fromBox: connectionStart.box,
                fromNode: connectionStart.node,
                toBox: boxIndex,
                toNode: inputIndex,
              },
            ]);
          }
        });
      });

      setIsConnecting(false);
      setConnectionStart(null);
      setTempConnection(null); // Clear temporary connection
    } else {
      setIsDraggingBox(false);
      setDraggingBoxIndex(null);
      setDragOffset(null);
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={500}
        height={400}
        style={{ border: "1px solid black" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setIsDraggingBox(false);
          setIsConnecting(false);
          setDraggingBoxIndex(null);
          setTempConnection(null); // Clear connection preview on mouse leave
        }}
      />
    </div>
  );
};

export default CanvasRoot;
