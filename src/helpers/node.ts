import { Box, Connection } from "../components/ConnectedCanvas";
import { NODE_INPUT_PADDING, NODE_OUTPUT_PADDING, NODE_RADIUS } from "./constants";

export type ConnectionLine = {
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string,
}

export type ConnectionIOCircle = {
  x: number,
  y: number,
  radius: number,
  color: string,
}

export const connectionLine = (fromBox: Box, toBox: Box, connection: Connection) : ConnectionLine => {
  const fromX = fromBox.x + fromBox.width + NODE_OUTPUT_PADDING; // Right side output
  const fromY =
    fromBox.y + (fromBox.height / (fromBox.outputs.length + 1)) * (connection.fromNode + 1);
  const toX = toBox.x - NODE_INPUT_PADDING; // Left side input
  const toY =
    toBox.y + (toBox.height / (toBox.inputs.length + 1)) * (connection.toNode + 1);

  // Determine connection color based only on the starting output node state
  const color = fromBox.outputs[connection.fromNode] === 1 ? "blue" : "gray";

  return {
    fromX,
    fromY,
    toX,
    toY,
    color,
  };
};


export const inputCircle = (inputIndex: number, inputState: number, box: Box) : ConnectionIOCircle => {
  const inputSpacing = box.height / (box.inputs.length + 1);
  const x = box.x - NODE_INPUT_PADDING;
  const y = box.y + inputSpacing * (inputIndex + 1);
  const color = inputState === 1 ? "green" : "gray";  // Active: green, Inactive: gray
  
  return {
    x,
    y,
    color,
    radius: NODE_RADIUS,
  };
};

export const outputCircle = (outputIndex: number, outputState: number, box: Box) : ConnectionIOCircle => {
  const outputSpacing = box.height / (box.outputs.length + 1);
  const x = box.x + box.width + NODE_OUTPUT_PADDING;
  const y = box.y + outputSpacing * (outputIndex + 1);
  const color = outputState === 1 ? "blue" : "gray"; // Active: blue, Inactive: gray
  
  return {
    x,
    y,
    color,
    radius: NODE_RADIUS,
  };
};
