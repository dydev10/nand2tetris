export type LookupTable = { [x: string]: string };

export const DESTINATIONS: LookupTable = {
  "null":   "000",
  "M":      "001",
  "D":      "010",
  "MD":     "011",
  "DM":     "011", // same as above but swapped identifiers (support both MD and DM)
  "A":      "100",
  "AM":     "101",
  "AD":     "110",
  "AMD":    "111",
  "ADM":    "111", // same as above but swapped identifiers (support both MD and DM)
};

export const JUMPS: LookupTable = {
  "null": "000",
  "JGT":  "001",
  "JEQ":  "010",
  "JGE":  "011",
  "JLT":  "100",
  "JNE":  "101",
  "JLE":  "110",
  "JMP":  "111",
};

// if code has M, then will be replaced by A for lookup
export const COMPS: LookupTable = {
  "null": "101010", // extra null case to be treated as 0 in code gen
  "0":    "101010",
  "1":    "111111",
  "-1":   "111010",
  "D":    "001100",
  "A":    "110000",
  "!D":   "001101",
  "!A":   "110001",
  "-D":   "001111",
  "-A":   "110011",
  "D+1":  "011111",
  "A+1":  "110111",
  "D-1":  "001110",
  "A-1":  "110010",
  "D+A":  "000010",
  "D-A":  "010011",
  "A-D":  "000111",
  "D&A":  "000000",
  "D|A":  "010101",
};

