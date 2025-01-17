import React from "react";
import { Box, Connection, TempConnection } from "../components/ConnectedCanvas";

function useCanvasRendering(
  ctx: CanvasRenderingContext2D | null,
  boxes: Box[],
  connections: Connection[],
  tempConnection: TempConnection,
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
        const connectionColor = fromBox.outputs[connection.fromNode] === 1 ? "blue" : "gray";
  
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

export default useCanvasRendering;
