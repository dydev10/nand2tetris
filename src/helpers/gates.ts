import { LogicGates } from "../enums/gate";
import { TRUTH_TABLE } from "./constants";

export const resolveGateOutputs = (chip: LogicGates, inputs: number[]): number[] => {  
  const inputKey = inputs.join('');
  const outputs : string | undefined = TRUTH_TABLE[chip]?.[inputKey];

  if (!outputs) {
    throw new Error('Invalid inputs received for truth table');
  }

  return outputs.split('').map((output) => parseInt(output, 10));
}
