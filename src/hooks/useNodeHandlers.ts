import React from "react";
import { TempConnection } from "../components/ConnectedCanvas";
import { CONNECTION_THRESHOLD, NODE_INPUT_PADDING, NODE_OUTPUT_PADDING } from "../helpers/constants";
import useNodeStore from "../stores/useNodeStore";

// Custom hook to handle node interaction logic
function useNodeHandlers(
  setTempConnection: React.Dispatch<React.SetStateAction<TempConnection>>,
  canvasRef: React.RefObject<HTMLCanvasElement>
) {
  const storeBoxes = useNodeStore(state => state.boxes);
  const toggleStoreBoxInput = useNodeStore(state => state.toggleBoxInput);
  const activateStoreBoxInput = useNodeStore(state => state.activateBoxInput);
  const dragStoreBox = useNodeStore(state => state.moveBox);
  const resolveStoreUpdatedGates = useNodeStore(state => state.resolveUpdatedGates);
  const storeConnections = useNodeStore(state => state.connections);
  const deleteStoreConnection = useNodeStore(state => state.deleteConnection);
  const addStoreConnection = useNodeStore(state => state.addConnection);

  const [isConnecting, setIsConnecting] = React.useState(false);
  const [connectionStart, setConnectionStart] = React.useState<{
    box: number;
    node: number;
  } | null>(null);

  const [isDraggingBox, setIsDraggingBox] = React.useState(false);
  const [draggingBoxIndex, setDraggingBoxIndex] = React.useState<number | null>(null);
  const [dragOffset, setDragOffset] = React.useState<{ x: number; y: number } | null>(null);

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
    storeBoxes.forEach((box, boxIndex) => {
      const inputSpacing = box.height / (box.inputs.length + 1);
      box.inputs.forEach((_, inputIndex) => {
        const nodeX = box.x - NODE_INPUT_PADDING;
        const nodeY = box.y + inputSpacing * (inputIndex + 1);
        const distance = Math.sqrt((mouseX - nodeX) ** 2 + (mouseY - nodeY) ** 2);
        if (distance <= CONNECTION_THRESHOLD) {
          toggleStoreBoxInput(boxIndex, inputIndex);
          actionTaken = true;
        }
      });
    });
  
    // Exit if an input node was toggled
    if (actionTaken) return;
  
    // Check if the user is starting a new connection (Output Node)
    storeBoxes.forEach((box, boxIndex) => {
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
    storeConnections.forEach((connection, index) => {
      const fromBox = storeBoxes[connection.fromBox];
      const toBox = storeBoxes[connection.toBox];
  
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
  
        // TODO: Add another constant for line click threshold instead of using connection's
        if (distance < CONNECTION_THRESHOLD) {
          // Delete the connection
          deleteStoreConnection(index);
          actionTaken = true;
        }
      }
    });
  
    // Exit if a connection was deleted
    if (actionTaken) return;
  
    // Existing logic for box dragging...
    storeBoxes.forEach((box, index) => {
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

    resolveStoreUpdatedGates();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isDraggingBox && draggingBoxIndex !== null && dragOffset) {
      const dragToX =  mouseX - dragOffset.x;
      const dragToY =  mouseY - dragOffset.y;
      
      dragStoreBox(draggingBoxIndex, dragToX, dragToY);
    }

    // Update temporary connection line while dragging
    if (isConnecting && connectionStart) {
      const fromBox = storeBoxes[connectionStart.box];
      const fromX = fromBox.x + fromBox.width + NODE_OUTPUT_PADDING;
      const fromY =
        fromBox.y + (fromBox.height / (fromBox.outputs.length + 1)) * (connectionStart.node + 1);
      setTempConnection({ fromX, fromY, toX: mouseX, toY: mouseY });
    }

    // resolveStoreUpdatedGates();
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
      storeBoxes.forEach((box, boxIndex) => {
        const inputSpacing = box.height / (box.inputs.length + 1);
        box.inputs.forEach((_, inputIndex) => {
          const nodeX = box.x - NODE_INPUT_PADDING;
          const nodeY = box.y + inputSpacing * (inputIndex + 1);
          const distance = Math.sqrt((mouseX - nodeX) ** 2 + (mouseY - nodeY) ** 2);
          if (distance <= CONNECTION_THRESHOLD) {
            addStoreConnection(connectionStart, boxIndex, inputIndex);

            // BROKEN: should update the input state based on the source output state
            const sourceBox = storeBoxes[connectionStart.box];
            const sourceOutputState = sourceBox.outputs[connectionStart.node]; // Get source output state
            if (sourceOutputState === 1) {
              activateStoreBoxInput(boxIndex, inputIndex);
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

    resolveStoreUpdatedGates();
  };

  return {
    handleNodeMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}

export default useNodeHandlers;
