export type GateTable = {
  [key: string]: string,
};

export type TruthTable = {
  [key: string]: GateTable,
};

export const TRUTH_TABLE: TruthTable = {
  NOT: {
    '0': '1',
    '1': '0',
  },
  OR: {
    '00': '0',
    '01': '1',
    '10': '1',
    '11': '1',
  },
  AND: {
    '00': '0',
    '01': '0',
    '10': '0',
    '11': '1',
  },
  NAND: {
    '00': '1',
    '01': '1',
    '10': '1',
    '11': '0',
  },
  // other gates will be generated in runtime
};

export const NODE_RADIUS = 5;
export const NODE_BORDER_THICKNESS = 5;
export const NODE_INPUT_PADDING = 10;
export const NODE_OUTPUT_PADDING = 10;

export const CONNECTION_THRESHOLD = 5;
export const CONNECTION_THICKNESS = 3.5;
export const CONNECTION_TEMP_THICKNESS = 2;
