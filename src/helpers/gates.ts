import { Box, Connection } from "../components/ConnectedCanvas";
import { LogicGates, TerminalNodes } from "../enums/gate";
import { TRUTH_TABLE } from "./constants";

// export type ChipNames = (typeof LogicGates) & (typeof TerminalNodes);
export type ChipNames = LogicGates | TerminalNodes;

export const resolveGateOutputs = (chip: ChipNames, inputs: number[]): number[] => {  
  const inputKey = inputs.join('');
  const outputs : string | undefined = TRUTH_TABLE[chip]?.[inputKey];

  if (outputs === null || outputs === undefined) {    
    throw new Error('Invalid inputs received for truth table');
  }

  return outputs.split('').map((output) => parseInt(output, 10));
}

export const resolveChain = (boxIndex: number, socketIndex: number, socketState: number, boxes: Box[], connections: Connection[], depth: number) => {
  const outChains = connections.filter((conn) => conn.fromBox === boxIndex);

  // mutate current box gate with new input/outputs in boxes array
  // TODO: check for all past node connection to see active nodes are still connected
  const newInputs = [...boxes[boxIndex].inputs]
  newInputs[socketIndex] = socketState;
  const newOutputs = resolveGateOutputs(boxes[boxIndex].name as ChipNames, newInputs);
  boxes[boxIndex] = {
    ...boxes[boxIndex],
    inputs: newInputs,
    outputs: newOutputs,
  };

  if (!newOutputs.length) {
    // terminal node, end recursion
    return;
  }

  // run chain for each socket(bit) one by one
  for (let outSocketIndex = 0; outSocketIndex < newOutputs.length; outSocketIndex++) {
    // each socket connection
    const socketChain = outChains.filter((conn) => conn.fromNode === outSocketIndex);
    
    if (!socketChain.length) {
      // end recursion      
      break;
    }  
    socketChain.forEach((chain) => {
      resolveChain(chain.toBox, chain.toNode, newOutputs[outSocketIndex], boxes, connections, depth + 1)
    });
  }
}

export const resolveTerminals = (boxes: Box[], connections: Connection[]): Box[] => { 
  // const pastSockets = boxes[0].inputs; // use this to support external in signals
  const pastSockets = boxes[0].outputs;
  const finalBoxes = [...boxes];
 
  // simulate inputs array value as set by code in state pastNode.outputs[] to start recursion
  pastSockets.forEach((state, index) => {
    resolveChain(0, index, state, finalBoxes, connections, 0);
  })

  return finalBoxes;
}
