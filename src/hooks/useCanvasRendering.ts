import React from "react";
import { TempConnection } from "../components/ConnectedCanvas";
import { CONNECTION_THICKNESS, CONNECTION_TEMP_THICKNESS, NODE_BORDER_THICKNESS, NODE_RADIUS, NODE_INPUT_PADDING, NODE_OUTPUT_PADDING } from "../helpers/constants";
import { drawBox, drawCircle, drawLine } from "../helpers/canvas";
import useNodeStore from "../stores/useNodeStore";
import { connectionLine } from "../helpers/node";

function useCanvasRendering(
  ctx: CanvasRenderingContext2D | null,
  tempConnection: TempConnection,
) {
  const storeConnections = useNodeStore(state => state.connections);
  const storeBoxes = useNodeStore(state => state.boxes);

  const redraw = React.useCallback(() => {
    if (!ctx) return;
  
    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
    // Set the background color
    ctx.fillStyle = "lightgray";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
    // Draw each box
    storeBoxes.forEach((box) => {
      // Draw box
      drawBox(
        ctx,
        box.x,
        box.y,
        box.width,
        box.height,
        'red',
        box.name,
        NODE_BORDER_THICKNESS
      );
  
      // Draw input nodes
      const inputSpacing = box.height / (box.inputs.length + 1);
      box.inputs.forEach((state, index) => {
        const nodeX = box.x - NODE_INPUT_PADDING;
        const nodeY = box.y + inputSpacing * (index + 1);
        const nodeColor = state === 1 ? "green" : "gray";  // Active: green, Inactive: gray
        drawCircle(ctx, nodeX, nodeY, NODE_RADIUS, nodeColor);
      });
  
      // Draw output nodes
      const outputSpacing = box.height / (box.outputs.length + 1);
      box.outputs.forEach((state, index) => {
        const nodeX = box.x + box.width + NODE_OUTPUT_PADDING;
        const nodeY = box.y + outputSpacing * (index + 1);
        const nodeColor = state === 1 ? "blue" : "gray"; // Active: blue, Inactive: gray
        drawCircle(ctx, nodeX, nodeY, NODE_RADIUS, nodeColor);
      });
    });
  
    // Draw connections
    storeConnections.forEach((connection) => {
      const fromBox = storeBoxes[connection.fromBox];
      const toBox = storeBoxes[connection.toBox];
      if (fromBox && toBox) {
        // Draw colored connection line on canvas
        const line = connectionLine(fromBox, toBox, connection);
        drawLine(
          ctx,
          line.fromX,
          line.fromY,
          line.toX,
          line.toY,
          line.color,
          CONNECTION_THICKNESS
        );
      }
    });
  
    // Draw the temporary connection (while dragging)
    if (tempConnection) {
      drawLine(
        ctx,
        tempConnection.fromX,
        tempConnection.fromY,
        tempConnection.toX,
        tempConnection.toY,
        'black',
        CONNECTION_TEMP_THICKNESS
      );
    }
  }, [ctx, storeBoxes, storeConnections, tempConnection]);

  React.useEffect(() => {
    redraw();
    console.log('Redrawing');
    
  }, [redraw]);

  return redraw;
}

export default useCanvasRendering;
