const R_SYMBOL_COUNT = 16;
const SPECIAL_SYMBOLS = {
  SCREEN: 16384,
  KBD: 24576,
  SP: 0,
  LCL: 1,
  ARG: 2,
  THIS: 3,
  THAT: 4,
}

class SymbolTable {
  symbols: { [x: string]: number };
  lineCount: number;
  allocateAddress: number;

  constructor() {
    this.symbols = {};
    this.lineCount = 0;
    this.allocateAddress = 16;

    this.fillReservedSymbols();
  }

  fillReservedSymbols() {
    // Fill register symbols R0...R15
    for (let i = 0; i < R_SYMBOL_COUNT; i++) {
      this.symbols[`R${i}`] = i;
    }

    // Fill special symbols
    Object.entries(SPECIAL_SYMBOLS).forEach(([key, value]) =>{
      this.symbols[key] = value;
    });
  }

  resolve(symbol: string) {
    return this.symbols[symbol] ?? null;
  }

  allocate(symbol: string): number {
    const address = this.allocateAddress;
    
    this.symbols[symbol] = address;
    this.allocateAddress++;
    
    return address;
  }

  processLine(source: string) {
    if (source.startsWith('(') && source.endsWith(')')) {
      const symbol = source.slice(1, -1);
      if (!this.resolve(symbol)) {
        this.symbols[symbol] = this.lineCount;
      }
    } else {
      this.lineCount++;
    }
  }
}

export default SymbolTable;
