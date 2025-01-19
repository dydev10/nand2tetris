export type GateTable = {
  [key: string]: string,
};

export type TruthTable = {
  [key: string]: GateTable,
};

export const TRUTH_TABLE: TruthTable = {
  PAST: {
   '00': '00',
    '01': '01',
    '10': '10',
    '11': '11',
  },
  NEXT: {
    '0': '0',
    '1': '1',
  },
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

export const TERMINAL_RADIUS = 8;
export const TERMINAL_THRESHOLD = 10;
export const TERMINAL_PAST_PADDING = 10;
export const TERMINAL_NEXT_PADDING = 10;

export const NODE_RADIUS = 5;
export const NODE_BORDER_THICKNESS = 5;
export const NODE_INPUT_PADDING = 10;
export const NODE_OUTPUT_PADDING = 10;

export const CONNECTION_THRESHOLD = 10;
export const CONNECTION_LINE_THRESHOLD = 5;
export const CONNECTION_THICKNESS = 3.5;
export const CONNECTION_TEMP_THICKNESS = 2;
