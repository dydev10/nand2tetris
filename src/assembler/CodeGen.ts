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


  numberStringTo15BitBinary = (numberString: string): string | null => {
    const number = parseInt(numberString, 10);

    if (isNaN(number) || number < 0 || number > 32767) {
      return null; // Return null for invalid input
    }

    const binary = number.toString(2);
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

    if (address) {
      this.result = `0${this.numberStringTo15BitBinary(address)}`;
      return;
    }

    this.result = `111${this.lookupComp(comp)}${this.lookupDest(dest)}${this.lookupJump(jump)}`;
  }
};

export default CodeGen;
