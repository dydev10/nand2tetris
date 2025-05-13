import { COMPS, DESTINATIONS, JUMPS } from "./codeLookup";
import Parser from "./Parser";

class CodeGen {
  isM: boolean;
  isAddress: boolean;
  isLabel: boolean;
  result: string | null;

  constructor(parser: Parser) {
    this.isM = false;
    this.isAddress = false;
    this.isLabel = false;
    this.result = null;

    this.generateCode(parser);
  }


  numberTo15BitBinary = (num: number): string | null => {
   
    if (isNaN(num) || num < 0 || num > 32767) {
      return null; // Return null for invalid input
    }

    const binary = num.toString(2);
    return binary.padStart(15, '0');
  }

  lookupComp = (comp: string | null) => {
    let lookup = comp;
    if (lookup?.includes("M")) {
      this.isM = true;
      lookup = lookup.replace(/M/g, "A");
    }

    const compBits = COMPS[String(lookup)];

    return `${this.isM ? '1' : '0'}${compBits}`;
  };

  lookupDest = (dest: string | null) => DESTINATIONS[String(dest)];
  lookupJump = (jump: string | null) => JUMPS[String(jump)];

  generateCode = (parser: Parser) => {
    const { address, dest, comp, jump } = parser;

    if (address !== null) {
      this.result = `0${this.numberTo15BitBinary(address)}`;
      return;
    }

    this.result = `111${this.lookupComp(comp)}${this.lookupDest(dest)}${this.lookupJump(jump)}`;
  }
};

export default CodeGen;
