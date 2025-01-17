import React from "react";
import { Box, Connection, TempConnection } from "../components/ConnectedCanvas";
import { CONNECTION_THRESHOLD, NODE_INPUT_PADDING, NODE_OUTPUT_PADDING } from "../helpers/constants";
import { resolveGateOutputs } from "../helpers/gates";
import { LogicGates } from "../enums/gate";

// Custom hook to handle node interaction logic
function useNodeHandlers(
  boxes: Box[],
  setBoxes: React.Dispatch<React.SetStateAction<Box[]>>,
  connections: Connection[],
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>,
  setTempConnection: React.Dispatch<React.SetStateAction<TempConnection>>,
  canvasRef: React.RefObject<HTMLCanvasElement>
) {
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [connectionStart, setConnectionStart] = React.useState<{
    box: number;
    node: number;
  } | null>(null);

  const [isDraggingBox, setIsDraggingBox] = React.useState(false);
  const [draggingBoxIndex, setDraggingBoxIndex] = React.useState<number | null>(null);
  const [dragOffset, setDragOffset] = React.useState<{ x: number; y: number } | null>(null);

  const resolveUpdatedGates = () => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((prevBox) =>({
        ...prevBox,
        outputs: resolveGateOutputs(prevBox.name as LogicGates, prevBox.inputs),
      }))
    );
  };

  const handleNodeMouseDown = (
    e: React.MouseEvent,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
  
    let actionTaken = false; // To track if any action (toggle or connection) was performed
  
    // Check if an input node is clicked to toggle its state
    boxes.forEach((box, boxIndex) => {
      const inputSpacing = box.height / (box.inputs.length + 1);
      box.inputs.forEach((_, inputIndex) => {
        const nodeX = box.x - NODE_INPUT_PADDING;
        const nodeY = box.y + inputSpacing * (inputIndex + 1);
        const distance = Math.sqrt((mouseX - nodeX) ** 2 + (mouseY - nodeY) ** 2);
        if (distance <= CONNECTION_THRESHOLD) {
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
          actionTaken = true;
        }
      });
    });
  
    // Exit if an input node was toggled
    if (actionTaken) return;
  
    // Check if the user is starting a new connection (Output Node)
    boxes.forEach((box, boxIndex) => {
      const outputSpacing = box.height / (box.outputs.length + 1);
      box.outputs.forEach((_, outputIndex) => {
        const nodeX = box.x + box.width + NODE_OUTPUT_PADDING;
        const nodeY = box.y + outputSpacing * (outputIndex + 1);
        const distance = Math.sqrt((mouseX - nodeX) ** 2 + (mouseY - nodeY) ** 2);
        if (distance <= CONNECTION_THRESHOLD) {
          setIsConnecting(true);
          setConnectionStart({ box: boxIndex, node: outputIndex });
          actionTaken = true;
        }
      });
    });
  
    // Exit if a connection was started
    if (actionTaken) return;
  
    // Check if the click is near a connection line (for deletion)
    connections.forEach((connection, index) => {
      const fromBox = boxes[connection.fromBox];
      const toBox = boxes[connection.toBox];
  
      if (fromBox && toBox) {
        const fromX = fromBox.x + fromBox.width + NODE_OUTPUT_PADDING; // Right side output
        const fromY =
          fromBox.y + (fromBox.height / (fromBox.outputs.length + 1)) * (connection.fromNode + 1);
        const toX = toBox.x - NODE_INPUT_PADDING; // Left side input
        const toY =
          toBox.y + (toBox.height / (toBox.inputs.length + 1)) * (connection.toNode + 1);
  
        // Check if the click is near this connection line
        const distance =
          Math.abs((toY - fromY) * mouseX - (toX - fromX) * mouseY + toX * fromY - toY * fromX) /
          Math.sqrt((toY - fromY) ** 2 + (toX - fromX) ** 2);
  
        // TODO: Add another constant for line click threshold
        if (distance < CONNECTION_THRESHOLD) {
          // Delete the connection
          setConnections((prev) => prev.filter((_, i) => i !== index));
          actionTaken = true;
        }
      }
    });
  
    // Exit if a connection was deleted
    if (actionTaken) return;
  
    // Existing logic for box dragging...
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

    resolveUpdatedGates();
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
      const fromX = fromBox.x + fromBox.width + NODE_OUTPUT_PADDING;
      const fromY =
        fromBox.y + (fromBox.height / (fromBox.outputs.length + 1)) * (connectionStart.node + 1);
      setTempConnection({ fromX, fromY, toX: mouseX, toY: mouseY });
    }

    // resolveUpdatedGates();
  };

  const handleMouseUp = (
    e: React.MouseEvent
  ) => {
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
          const nodeX = box.x - NODE_INPUT_PADDING;
          const nodeY = box.y + inputSpacing * (inputIndex + 1);
          const distance = Math.sqrt((mouseX - nodeX) ** 2 + (mouseY - nodeY) ** 2);
          if (distance <= CONNECTION_THRESHOLD) {
            setConnections((prev) => [
              ...prev,
              {
                fromBox: connectionStart.box,
                fromNode: connectionStart.node,
                toBox: boxIndex,
                toNode: inputIndex,
              },
            ]);

            // BROKEN: Updates the input state based on the source output state
            const sourceBox = boxes[connectionStart.box];
            const sourceOutputState = sourceBox.outputs[connectionStart.node]; // Get source output state
            if (sourceOutputState === 1) {
              // Set the input node state to active
              setBoxes((prev) =>
                prev.map((b, i) =>
                  i === boxIndex
                    ? {
                        ...b,
                        inputs: b.inputs.map((state, j) =>
                          j === inputIndex ? 1 : state
                        ),
                      }
                    : b
                )
              );
            }
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

    resolveUpdatedGates();
  };

  return {
    handleNodeMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}

export default useNodeHandlers;
