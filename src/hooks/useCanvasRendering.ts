import React from "react";
import { TempConnection } from "../components/ConnectedCanvas";
import { CONNECTION_THICKNESS, CONNECTION_TEMP_THICKNESS, NODE_BORDER_THICKNESS } from "../helpers/constants";
import { drawBox, drawCircle, drawLine } from "../helpers/canvas";
import useNodeStore from "../stores/useNodeStore";
import { connectionLine, inputCircle, outputCircle, terminalCircle } from "../helpers/node";
import { TerminalNodes } from "../enums/gate";

function useCanvasRendering(
  ctx: CanvasRenderingContext2D | null,
  tempConnection: TempConnection,
) {
  const pastNode = useNodeStore(state => state.pastNode);
  const nextNode = useNodeStore(state => state.nextNode);
  const terminalConnections = useNodeStore(state => state.terminalConnections);
  const storeConnections = useNodeStore(state => state.connections);
  const storeBoxes = useNodeStore(state => state.boxes);

  const redraw = React.useCallback(() => {
    if (!ctx) return;
  
    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
    // Set the background color
    ctx.fillStyle = "lightgray";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // draw terminal IO nodes and connections [flipped: read from outputs of past node, write to input of next node]
    // Draw terminal past output nodes
    if (pastNode) {
      drawBox(ctx, pastNode.x, pastNode.y, pastNode.width, pastNode.height, 'green');
      pastNode.outputs.forEach((state, index) => {
        const circle = terminalCircle(TerminalNodes.PAST, index, state, pastNode);
        drawCircle(ctx, circle.x, circle.y, circle.radius, circle.color);
      });
    }
    // Draw next input nodes
    if (nextNode) {
      drawBox(ctx, nextNode.x, nextNode.y, nextNode.width, nextNode.height, 'blue');
      nextNode.inputs.forEach((state, index) => {
        const circle = terminalCircle(TerminalNodes.NEXT, index, state, nextNode);
        drawCircle(ctx, circle.x, circle.y, circle.radius, circle.color);
      });

    }
    // Draw connections
    terminalConnections.forEach((connection) => {
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
      box.inputs.forEach((state, index) => {
        const circle = inputCircle(index, state, box);
        drawCircle(ctx, circle.x, circle.y, circle.radius, circle.color);
      });
  
      // Draw output nodes
      box.outputs.forEach((state, index) => {
        const circle = outputCircle(index, state, box);
        drawCircle(ctx, circle.x, circle.y, circle.radius, circle.color);
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
  }, [ctx, storeBoxes, storeConnections, tempConnection, terminalConnections, pastNode, nextNode]);

  React.useEffect(() => {
    redraw();
  }, [redraw]);

  return redraw;
}

export default useCanvasRendering;
