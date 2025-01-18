import { Box, Connection } from "../components/ConnectedCanvas";
import { NODE_INPUT_PADDING, NODE_OUTPUT_PADDING } from "./constants";

export type ConnectionLine = {
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
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
