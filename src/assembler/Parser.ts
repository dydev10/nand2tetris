import SymbolTable from "./SymbolTable";

class Parser {
  // label: string | null;
  address: number | null;
  dest: string | null;
  comp: string | null;
  jump: string | null;
  skip: boolean;

  symbolTable: SymbolTable;

  constructor(source: string, symbolTable: SymbolTable) {
    // this.label = null;
    this.address = null;
    this.dest = null;
    this.comp = null;
    this.jump = null;
    this.skip = false;

    this.symbolTable = symbolTable;

    this.parse(source);
  }

  isAddress(source: string) {
    return source?.startsWith('@');
  }

  parseAddress(source: string) {
    const addressStr = source.substring(1);
    
    // check if symbol is used or simple address
    if (isNaN(Number(addressStr))) {
      const resolved = this.symbolTable.resolve(addressStr);
      if(resolved !== null) {
        // symbol already in table
        this.address = resolved;
      } else {
        // allocate new symbol address
        this.address = this.symbolTable.allocate(addressStr);
      }
    } else {
      this.address = parseInt(addressStr, 10);
    }
  }

  parseCode(source: string) {
    let buffer = '';
    for (let i = 0; i < source.length; i++) {
      const c = source[i];

      switch (c) {
        case '=':
          this.dest = buffer;
          buffer = '';
          break;
      
        case ';':
          this.comp = buffer
          buffer = '';
          break;
      
        default:
          buffer += c;
          break;
      }
    }

    if (this.comp) {
      this.jump = buffer;
    } else {
      this.comp = buffer
    }
  }

  parse(source: string) {
    // skip labels
    if(source.startsWith('(') && source.endsWith(')')) {
      this.skip = true;
      return;
    }

    if (this.isAddress(source)) {
      this.parseAddress(source);
    } else {
      this.parseCode(source);
    }
  }
}

export default Parser;
